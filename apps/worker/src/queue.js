'use strict';

const { Queue, Worker } = require('bullmq');
const IORedis = require('ioredis');
const { logger } = require('./lib/logger');

const QUEUE_NAME = 'truewell-jobs';

function connect() {
  return new IORedis(process.env.REDIS_URL || 'redis://localhost:6379/0', { maxRetriesPerRequest: null });
}

function createQueue(connection = connect()) {
  return new Queue(QUEUE_NAME, {
    connection,
    defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 5000 }, removeOnComplete: 200, removeOnFail: 500 },
  });
}

function createWorker(handlers, connection = connect()) {
  const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
      const handler = handlers[job.name];
      if (!handler) throw new Error(`no handler registered for ${job.name}`);
      return handler(job.data);
    },
    { connection, concurrency: Number(process.env.WORKER_CONCURRENCY || 4) },
  );
  worker.on('completed', (job, result) => logger.info('job completed', { job: job.name, result }));
  worker.on('failed', (job, err) => logger.error('job failed', { job: job && job.name, error: err.message }));
  return worker;
}

module.exports = { QUEUE_NAME, createQueue, createWorker };
