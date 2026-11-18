'use strict';

const { run, nextAttemptAt, MAX_ATTEMPTS } = require('../src/jobs/reminderDispatch');
const { NotifierError } = require('../src/lib/notifier');

const NOW = new Date('2025-06-02T12:00:00Z');

function fakeDb(reminders) {
  const updates = [];
  return {
    updates,
    reminder: {
      findMany: async () => reminders,
      update: async (args) => {
        updates.push(args);
        return args;
      },
    },
  };
}

const reminder = (over = {}) => ({ id: 'r1', channel: 'EMAIL', patientId: 'p1', message: 'hi', attempts: 0, ...over });

describe('reminder dispatch', () => {
  test('marks delivered reminders as sent', async () => {
    const db = fakeDb([reminder()]);
    const summary = await run({ db, notifier: { dispatch: async () => ({}) }, now: NOW });
    expect(summary).toEqual({ sent: 1, failed: 0, retried: 0 });
    expect(db.updates[0].data.status).toBe('SENT');
  });

  test('reschedules transient failures with exponential backoff', async () => {
    const db = fakeDb([reminder({ attempts: 1 })]);
    const summary = await run({ db, notifier: { dispatch: async () => { throw new NotifierError('boom', 503); } }, now: NOW });
    expect(summary.retried).toBe(1);
    expect(db.updates[0].data.sendAt).toEqual(nextAttemptAt(2, NOW));
    expect(nextAttemptAt(2, NOW) - NOW).toBe(20 * 60_000);
  });

  test('gives up on permanent errors and after max attempts', async () => {
    const permanent = fakeDb([reminder()]);
    await run({ db: permanent, notifier: { dispatch: async () => { throw new NotifierError('bad', 422); } }, now: NOW });
    expect(permanent.updates[0].data.status).toBe('FAILED');

    const exhausted = fakeDb([reminder({ attempts: MAX_ATTEMPTS - 1 })]);
    const summary = await run({ db: exhausted, notifier: { dispatch: async () => { throw new NotifierError('down', 502); } }, now: NOW });
    expect(summary.failed).toBe(1);
  });
});
