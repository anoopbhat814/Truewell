'use strict';

const { matches, dueJobs, JOBS } = require('../src/schedule');

describe('schedule', () => {
  const at = (h, m) => new Date(Date.UTC(2025, 5, 2, h, m));

  test('matches fixed and stepped fields', () => {
    expect(matches('*/5 *', at(10, 15))).toBe(true);
    expect(matches('*/5 *', at(10, 16))).toBe(false);
    expect(matches('15 3', at(3, 15))).toBe(true);
    expect(matches('15 3', at(4, 15))).toBe(false);
  });

  test('rejects malformed expressions', () => {
    expect(() => matches('5', at(0, 0))).toThrow(/invalid schedule/);
  });

  test('dueJobs returns only jobs due at the minute', () => {
    expect(dueJobs(at(3, 15)).map((j) => j.name)).toEqual(['reminder-scan', 'lab-release', 'session-cleanup']);
    expect(dueJobs(at(5, 0)).map((j) => j.name)).toEqual(['reminder-scan', 'lab-release', 'claims-sweep']);
    expect(dueJobs(at(5, 1), JOBS)).toEqual([]);
  });
});
