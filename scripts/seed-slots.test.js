'use strict';

const { slotTimes } = require('./seed-slots');

test('slots skip weekends and are 20 minutes long', () => {
  const monday = new Date(Date.UTC(2025, 5, 2));
  const slots = [...slotTimes(monday, 1)];
  expect(slots.every((s) => ![0, 6].includes(s.startsAt.getUTCDay()))).toBe(true);
  expect(slots.every((s) => s.endsAt - s.startsAt === 20 * 60_000)).toBe(true);
  expect(slots).toHaveLength(5 * 7 * 3);
});
