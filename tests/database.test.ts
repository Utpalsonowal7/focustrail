import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import type { SQLiteDatabase } from 'expo-sqlite';
import { migrate } from '../src/db/migrate';
import { saveTask, toggleTask, deleteTask } from '../src/db/tasks';
import { saveHabit, toggleHabit } from '../src/db/habits';
import {
  startTimer,
  finishTimer,
  pauseTimer,
  resumeTimer,
} from '../src/db/timer';
import { saveSettings, readSettings } from '../src/db/settings';
function database() {
  const raw = new DatabaseSync(':memory:');
  const adapter = {
    execAsync: async (sql: string) => {
      raw.exec(sql);
    },
    runAsync: async (sql: string, ...params: (string | number | null)[]) =>
      raw.prepare(sql).run(...params),
    getFirstAsync: async (sql: string, ...params: (string | number | null)[]) =>
      raw.prepare(sql).get(...params) ?? null,
    getAllAsync: async (sql: string, ...params: (string | number | null)[]) =>
      raw.prepare(sql).all(...params),
    withExclusiveTransactionAsync: async (
      fn: (db: SQLiteDatabase) => Promise<void>,
    ) => {
      raw.exec('BEGIN');
      try {
        await fn(adapter as unknown as SQLiteDatabase);
        raw.exec('COMMIT');
      } catch (e) {
        raw.exec('ROLLBACK');
        throw e;
      }
    },
  };
  return { db: adapter as unknown as SQLiteDatabase, raw };
}
const task = {
  id: 't',
  title: "Read O'Reilly",
  notes: '',
  priority: 'high' as const,
  due: '2026-10-26',
  done: 0,
  completed_on: null,
  created_at: 1,
};
test('migrations are repeatable and preserve data', async () => {
  const { db, raw } = database();
  await migrate(db);
  await saveTask(db, task);
  await migrate(db);
  assert.equal((await db.getAllAsync('SELECT * FROM tasks')).length, 1);
  raw.close();
});
test('task update preserves completion and deletion nulls session links', async () => {
  const { db, raw } = database();
  await migrate(db);
  await saveTask(db, task);
  await toggleTask(db, 't');
  await saveTask(db, { ...task, title: 'Changed' });
  assert.equal(
    (await db.getFirstAsync<{ done: number }>('SELECT done FROM tasks'))?.done,
    1,
  );
  await db.runAsync("INSERT INTO sessions VALUES('s','t',60,'2026-10-26',1)");
  await deleteTask(db, 't');
  assert.equal(
    (await db.getFirstAsync<{ task_id: null }>('SELECT task_id FROM sessions'))
      ?.task_id,
    null,
  );
  raw.close();
});
test('habit check-ins toggle without duplicates', async () => {
  const { db, raw } = database();
  await migrate(db);
  await saveHabit(db, 'h', 'Read');
  await toggleHabit(db, 'h');
  assert.equal((await db.getAllAsync('SELECT * FROM checkins')).length, 1);
  await toggleHabit(db, 'h');
  assert.equal((await db.getAllAsync('SELECT * FROM checkins')).length, 0);
  raw.close();
});
test('timer enforces singleton and finalizes exactly once', async () => {
  const { db, raw } = database();
  await migrate(db);
  await startTimer(db, 's', 60, 'focus', null);
  await assert.rejects(() => startTimer(db, 'other', 60, 'focus', null));
  await finishTimer(db, Date.now() + 61000);
  await finishTimer(db, Date.now() + 61000);
  assert.equal((await db.getAllAsync('SELECT * FROM sessions')).length, 1);
  assert.equal(await db.getFirstAsync('SELECT * FROM timer'), null);
  raw.close();
});
test('paused sessions persist and breaks do not inflate focus totals', async () => {
  const { db, raw } = database();
  await migrate(db);
  await startTimer(db, 's', 60, 'break', null);
  const t = await db.getFirstAsync<any>('SELECT * FROM timer');
  await pauseTimer(db, t);
  await finishTimer(db, Date.now() + 100000);
  assert.ok(await db.getFirstAsync('SELECT * FROM timer'));
  const paused = await db.getFirstAsync<any>('SELECT * FROM timer');
  await resumeTimer(db, paused);
  await finishTimer(db, Date.now() + 100000);
  assert.equal((await db.getAllAsync('SELECT * FROM sessions')).length, 0);
  raw.close();
});
test('invalid settings cannot overwrite valid preferences', async () => {
  const { db, raw } = database();
  await migrate(db);
  await saveSettings(db, { name: 'Utpal', focus: 30, rest: 5, goal: 90 });
  await assert.rejects(() =>
    saveSettings(db, { name: 'Utpal', focus: -1, rest: 5, goal: 90 }),
  );
  assert.equal((await readSettings(db)).focus, 30);
  raw.close();
});
