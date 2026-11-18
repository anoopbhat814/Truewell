'use strict';

const { getDb } = require('../lib/db');
const { logger } = require('../lib/logger');

const STALE_DAYS = 14;

function staleBefore(now, days = STALE_DAYS) {
  return new Date(now.getTime() - days * 86_400_000);
}

async function run({ db = getDb(), now = new Date() } = {}) {
  const stale = await db.claim.findMany({
    where: { status: 'SUBMITTED', submittedAt: { lte: staleBefore(now) } },
    select: { id: true, totalCents: true, submittedAt: true },
  });
  for (const claim of stale) {
    logger.warn('claim awaiting payer response', { claimId: claim.id, totalCents: claim.totalCents });
  }
  return { stale: stale.length, totalCents: stale.reduce((sum, c) => sum + c.totalCents, 0) };
}

module.exports = { run, staleBefore, STALE_DAYS };
