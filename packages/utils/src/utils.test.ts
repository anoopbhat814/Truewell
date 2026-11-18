import { describe, expect, it } from 'vitest';
import {
  ageFromDob,
  classifyResult,
  completion,
  estimatePatientShare,
  formatCents,
  formatRange,
  initials,
  isSameDay,
  maskEmail,
  maskMemberId,
  maskPhone,
  nextDue,
  overdue,
  rangePosition,
  toIsoDate,
} from './index';

describe('dates', () => {
  it('computes age around the birthday', () => {
    const now = new Date('2025-06-14T12:00:00');
    expect(ageFromDob('2000-06-15', now)).toBe(24);
    expect(ageFromDob('2000-06-14', now)).toBe(25);
  });

  it('formats and compares days', () => {
    expect(toIsoDate(new Date(2025, 0, 5))).toBe('2025-01-05');
    expect(isSameDay(new Date(2025, 0, 5, 1), new Date(2025, 0, 5, 23))).toBe(true);
  });
});

describe('money', () => {
  it('formats cents as currency', () => {
    expect(formatCents(12345)).toBe('$123.45');
  });

  it('estimates patient share like the API', () => {
    expect(estimatePatientShare(10_000, 2_000, 5_000, 0.2)).toBe(2_000 + 5_000 + 600);
    expect(estimatePatientShare(1_500, 3_000, 0)).toBe(1_500);
  });
});

describe('labs', () => {
  const range = { refLow: 70, refHigh: 99 };
  it.each([
    [85, 'NORMAL'],
    [65, 'LOW'],
    [105, 'HIGH'],
    [20, 'CRITICAL_LOW'],
    [140, 'CRITICAL_HIGH'],
  ])('classifies %s as %s', (value, flag) => {
    expect(classifyResult({ value, ...range })).toBe(flag);
  });

  it('formats ranges and positions', () => {
    expect(formatRange(70, 99, 'mg/dL')).toBe('70 - 99 mg/dL');
    expect(formatRange(null, 5)).toBe('<= 5');
    expect(rangePosition({ value: 84.5, ...range })).toBeCloseTo(0.5, 2);
    expect(rangePosition({ value: 1 })).toBeNull();
  });
});

describe('phi', () => {
  it('masks identifiers', () => {
    expect(maskEmail('jane@patients.example')).toBe('j***@patients.example');
    expect(maskPhone('+1 555 010 1234')).toBe('***-***-1234');
    expect(maskMemberId('EHP-5550001')).toBe('EH*******01');
    expect(initials('ana', 'lopez')).toBe('AL');
  });
});

describe('care plans', () => {
  const tasks = [
    { completedAt: '2025-01-01', dueOn: '2025-01-02' },
    { completedAt: null, dueOn: '2025-02-01' },
    { completedAt: null, dueOn: '2025-03-01' },
  ];
  it('summarises progress', () => {
    expect(completion(tasks)).toBe(33);
    expect(overdue(tasks, '2025-02-15')).toHaveLength(1);
    expect(nextDue(tasks)?.dueOn).toBe('2025-02-01');
    expect(completion([])).toBe(0);
  });
});
