'use strict';

const { PrismaClient } = require('@prisma/client');

let client;

function getDb() {
  if (!client) client = new PrismaClient({ log: ['warn', 'error'] });
  return client;
}

async function closeDb() {
  if (client) await client.$disconnect();
  client = undefined;
}

module.exports = { getDb, closeDb };
