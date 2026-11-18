'use strict';

const { getDb } = require('../lib/db');

async function run({ db = getDb(), now = new Date() } = {}) {
  const retentionDays = Number(process.env.SESSION_RETENTION_DAYS || 30);
  const cutoff = new Date(now.getTime() - retentionDays * 86_400_000);
  const { count } = await db.session.deleteMany({ where: { expiresAt: { lt: cutoff } } });
  return { deleted: count };
}

module.exports = { run };
