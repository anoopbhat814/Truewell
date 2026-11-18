'use strict';

const reminderScan = require('../src/jobs/reminderScan');
const labRelease = require('../src/jobs/labRelease');
const claimsSweep = require('../src/jobs/claimsSweep');
const sessionCleanup = require('../src/jobs/sessionCleanup');
const { logger } = require('../src/lib/logger');

const NOW = new Date('2025-06-02T12:00:00Z');

describe('reminderScan', () => {
  test('formats messages in UTC', () => {
    expect(reminderScan.reminderMessage({ startsAt: new Date('2025-06-03T09:30:00Z') })).toBe(
      'Reminder: you have an appointment on 2025-06-03 09:30 UTC.',
    );
  });

  test('creates one reminder per unreminded appointment', async () => {
    const created = [];
    const db = {
      appointment: { findMany: async () => [{ id: 'a1', patientId: 'p1', startsAt: new Date('2025-06-03T09:00:00Z') }] },
      reminder: { createMany: async ({ data }) => created.push(...data) },
    };
    expect(await reminderScan.run({ db, now: NOW })).toEqual({ created: 1 });
    expect(created[0]).toMatchObject({ appointmentId: 'a1', channel: 'EMAIL' });
  });

  test('skips the write when there is nothing to remind', async () => {
    const db = { appointment: { findMany: async () => [] }, reminder: { createMany: () => { throw new Error('should not be called'); } } };
    expect(await reminderScan.run({ db, now: NOW })).toEqual({ created: 0 });
  });
});

describe('labRelease', () => {
  test('cutoff honours the delay and never releases critical results', async () => {
    expect(labRelease.releaseCutoff(NOW, 12).toISOString()).toBe('2025-06-02T00:00:00.000Z');
    let where;
    const db = { labResult: { updateMany: async (args) => { where = args.where; return { count: 3 }; } } };
    expect(await labRelease.run({ db, now: NOW })).toEqual({ released: 3 });
    expect(where.flag.notIn).toEqual(['CRITICAL_LOW', 'CRITICAL_HIGH']);
  });
});

describe('claimsSweep', () => {
  test('totals stale submitted claims', async () => {
    jest.spyOn(logger, 'warn').mockImplementation(() => undefined);
    const db = { claim: { findMany: async () => [{ id: 'c1', totalCents: 1000 }, { id: 'c2', totalCents: 2500 }] } };
    expect(await claimsSweep.run({ db, now: NOW })).toEqual({ stale: 2, totalCents: 3500 });
    expect(claimsSweep.staleBefore(NOW).toISOString()).toBe('2025-05-19T12:00:00.000Z');
  });
});

describe('sessionCleanup', () => {
  test('deletes sessions expired beyond retention', async () => {
    let cutoff;
    const db = { session: { deleteMany: async ({ where }) => { cutoff = where.expiresAt.lt; return { count: 4 }; } } };
    expect(await sessionCleanup.run({ db, now: NOW })).toEqual({ deleted: 4 });
    expect(cutoff.toISOString()).toBe('2025-05-03T12:00:00.000Z');
  });
});
