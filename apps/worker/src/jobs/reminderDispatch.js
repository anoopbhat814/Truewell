'use strict';

const { getDb } = require('../lib/db');
const { createNotifier } = require('../lib/notifier');

const MAX_ATTEMPTS = 3;
const BASE_BACKOFF_MS = 10 * 60_000;

function nextAttemptAt(attempts, now) {
  return new Date(now.getTime() + BASE_BACKOFF_MS * 2 ** Math.max(attempts - 1, 0));
}

async function run({ db = getDb(), notifier = createNotifier(), now = new Date(), limit = 100 } = {}) {
  const due = await db.reminder.findMany({
    where: { status: 'PENDING', sendAt: { lte: now } },
    orderBy: { sendAt: 'asc' },
    take: limit,
  });
  const summary = { sent: 0, failed: 0, retried: 0 };
  for (const reminder of due) {
    try {
      await notifier.dispatch({ id: reminder.id, channel: reminder.channel, patient_id: reminder.patientId, message: reminder.message });
      await db.reminder.update({ where: { id: reminder.id }, data: { status: 'SENT', sentAt: now, attempts: { increment: 1 } } });
      summary.sent += 1;
    } catch (err) {
      const attempts = reminder.attempts + 1;
      const giveUp = err.permanent || attempts >= MAX_ATTEMPTS;
      await db.reminder.update({
        where: { id: reminder.id },
        data: giveUp
          ? { status: 'FAILED', attempts, lastError: String(err.message).slice(0, 500) }
          : { attempts, lastError: String(err.message).slice(0, 500), sendAt: nextAttemptAt(attempts, now) },
      });
      if (giveUp) summary.failed += 1;
      else summary.retried += 1;
    }
  }
  return summary;
}

module.exports = { run, nextAttemptAt, MAX_ATTEMPTS };
