'use strict';

const { getDb } = require('../lib/db');

const CRITICAL = ['CRITICAL_LOW', 'CRITICAL_HIGH'];

function releaseCutoff(now, delayHours = Number(process.env.LAB_RELEASE_DELAY_HOURS || 12)) {
  return new Date(now.getTime() - delayHours * 3600_000);
}

async function run({ db = getDb(), now = new Date() } = {}) {
  const { count } = await db.labResult.updateMany({
    where: { releasedToPatient: false, resultedAt: { lte: releaseCutoff(now) }, flag: { notIn: CRITICAL } },
    data: { releasedToPatient: true },
  });
  return { released: count };
}

module.exports = { run, releaseCutoff, CRITICAL };
