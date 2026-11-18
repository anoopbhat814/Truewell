'use strict';

const { getDb } = require('../lib/db');

const LEAD_HOURS = 24;

/** Pure helper so the message format is testable without a database. */
function reminderMessage(appointment) {
  const when = appointment.startsAt.toISOString().replace('T', ' ').slice(0, 16);
  return `Reminder: you have an appointment on ${when} UTC.`;
}

async function run({ db = getDb(), now = new Date() } = {}) {
  const horizon = new Date(now.getTime() + LEAD_HOURS * 3600_000);
  const appointments = await db.appointment.findMany({
    where: { status: 'CONFIRMED', startsAt: { gt: now, lte: horizon }, reminders: { none: {} } },
    select: { id: true, patientId: true, startsAt: true },
  });
  if (appointments.length === 0) return { created: 0 };
  await db.reminder.createMany({
    data: appointments.map((a) => ({
      patientId: a.patientId,
      appointmentId: a.id,
      channel: 'EMAIL',
      message: reminderMessage(a),
      sendAt: now,
    })),
  });
  return { created: appointments.length };
}

module.exports = { run, reminderMessage, LEAD_HOURS };
