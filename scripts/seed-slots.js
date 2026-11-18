#!/usr/bin/env node
'use strict';

// Generates weekday availability for every clinician for the next N weeks.
const { PrismaClient } = require('@prisma/client');

const WEEKS = Number(process.argv[2] || 2);
const SLOT_MINUTES = 20;
const HOURS = [9, 10, 11, 13, 14, 15, 16];

function* slotTimes(from, weeks) {
  for (let d = 0; d < weeks * 7; d += 1) {
    const day = new Date(from);
    day.setUTCDate(day.getUTCDate() + d);
    if ([0, 6].includes(day.getUTCDay())) continue;
    for (const hour of HOURS) {
      for (let minute = 0; minute < 60; minute += SLOT_MINUTES) {
        const startsAt = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), hour, minute));
        yield { startsAt, endsAt: new Date(startsAt.getTime() + SLOT_MINUTES * 60_000) };
      }
    }
  }
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const clinicians = await prisma.clinician.findMany({ select: { id: true } });
    const from = new Date();
    let created = 0;
    for (const { id } of clinicians) {
      const data = [...slotTimes(from, WEEKS)].filter((s) => s.startsAt > from).map((s) => ({ clinicianId: id, ...s }));
      const res = await prisma.availabilitySlot.createMany({ data, skipDuplicates: true });
      created += res.count;
    }
    console.info(`Created ${created} slots for ${clinicians.length} clinicians.`);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) main().catch((e) => { console.error(e); process.exit(1); });

module.exports = { slotTimes };
