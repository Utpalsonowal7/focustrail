import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dayKey, shiftDay, validDay, clock } from '../src/utils/dates';
import { remaining } from '../src/utils/timer';
import { streak, weekly } from '../src/features/insights/metrics';
import { title, minutes } from '../src/utils/validation';
test('calendar arithmetic crosses leap days and years', () => {
  assert.equal(shiftDay('2024-03-01', -1), '2024-02-29');
  assert.equal(shiftDay('2026-01-01', -1), '2025-12-31');
  assert.equal(validDay('2026-02-29'), false);
  assert.equal(validDay('2024-02-29'), true);
  assert.equal(dayKey(new Date(2026, 9, 26, 0, 1)), '2026-10-26');
});
test('deadline survives suspension and pause freezes time', () => {
  const timer = {
    id: 't',
    task_id: null,
    duration: 1500,
    remaining: 900,
    deadline: 100000,
    kind: 'focus' as const,
  };
  assert.equal(remaining(timer, 70000), 30);
  assert.equal(remaining(timer, 200000), 0);
  assert.equal(remaining({ ...timer, deadline: null }, 200000), 900);
  assert.equal(clock(61), '01:01');
});
test('habit streak includes yesterday before today is checked', () => {
  const logs = ['2026-10-24', '2026-10-25'].map((day) => ({
    habit_id: 'a',
    day,
  }));
  assert.equal(streak('a', logs, '2026-10-26'), 2);
  assert.equal(streak('a', logs, '2026-10-27'), 0);
  assert.equal(streak('b', logs, '2026-10-26'), 0);
});
test('empty week still contains seven zero days', () => {
  assert.equal(weekly([], '2026-10-26').length, 7);
  assert.equal(weekly([], '2026-10-26')[0].day, '2026-10-20');
});
test('input bounds reject blank titles and fractional minutes', () => {
  assert.throws(() => title('   '));
  assert.throws(() => minutes(0));
  assert.throws(() => minutes(1.5));
  assert.throws(() => minutes(181));
  assert.equal(title(' Read '), 'Read');
});
