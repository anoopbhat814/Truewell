'use strict';

const { logger } = require('./lib/logger');
const { closeDb } = require('./lib/db');
const { createQueue, createWorker } = require('./queue');
const { dueJobs } = require('./schedule');

const handlers = {
  'reminder-scan': () => require('./jobs/reminderScan').run(),
  'reminder-dispatch': () => require('./jobs/reminderDispatch').run(),
  'lab-release': () => require('./jobs/labRelease').run(),
  'claims-sweep': () => require('./jobs/claimsSweep').run(),
  'session-cleanup': () => require('./jobs/sessionCleanup').run(),
};

async function main() {
  const queue = createQueue();
  const worker = createWorker(handlers);

  // Dispatch runs on a short repeatable interval; everything else follows schedule.js once a minute.
  await queue.add('reminder-dispatch', {}, { repeat: { every: 30_000 }, jobId: 'reminder-dispatch' });
  const tick = setInterval(async () => {
    for (const job of dueJobs(new Date())) await queue.add(job.name, {}, { jobId: `${job.name}:${Math.floor(Date.now() / 60_000)}` });
  }, 60_000);

  logger.info('worker started', { jobs: Object.keys(handlers) });

  const shutdown = async (signal) => {
    logger.info('shutting down', { signal });
    clearInterval(tick);
    await worker.close();
    await queue.close();
    await closeDb();
    process.exit(0);
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((err) => {
  logger.error('worker crashed', { error: err.message });
  process.exit(1);
});
