'use strict';

/**
 * Tiny cron-like matcher supporting "*", "*\/n" and fixed numbers for minute and hour fields.
 * Enough for the worker's own schedules without pulling in a cron dependency.
 */
function fieldMatches(spec, value) {
  if (spec === '*') return true;
  if (spec.startsWith('*/')) {
    const step = Number(spec.slice(2));
    return Number.isInteger(step) && step > 0 && value % step === 0;
  }
  return Number(spec) === value;
}

function matches(expression, date) {
  const [minute, hour] = expression.trim().split(/\s+/);
  if (minute === undefined || hour === undefined) throw new Error(`invalid schedule: ${expression}`);
  return fieldMatches(minute, date.getUTCMinutes()) && fieldMatches(hour, date.getUTCHours());
}

const JOBS = [
  { name: 'reminder-scan', cron: '*/5 *', module: './jobs/reminderScan' },
  { name: 'lab-release', cron: '*/10 *', module: './jobs/labRelease' },
  { name: 'claims-sweep', cron: '0 *', module: './jobs/claimsSweep' },
  { name: 'session-cleanup', cron: '15 3', module: './jobs/sessionCleanup' },
];

function dueJobs(date, jobs = JOBS) {
  return jobs.filter((j) => matches(j.cron, date));
}

module.exports = { JOBS, matches, dueJobs };
