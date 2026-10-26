import type { SQLiteDatabase } from 'expo-sqlite';
import { title } from '../utils/validation';
import { dayKey } from '../utils/dates';
export async function saveHabit(db: SQLiteDatabase, id: string, name: string) {
  await db.runAsync(
    'INSERT INTO habits VALUES(?,?,?,0) ON CONFLICT(id) DO UPDATE SET title=excluded.title',
    id,
    title(name),
    dayKey(),
  );
}
export async function toggleHabit(
  db: SQLiteDatabase,
  id: string,
  day = dayKey(),
) {
  await db.withExclusiveTransactionAsync(async (tx) => {
    const row = await tx.getFirstAsync(
      'SELECT 1 FROM checkins WHERE habit_id=? AND day=?',
      id,
      day,
    );
    if (row)
      await tx.runAsync(
        'DELETE FROM checkins WHERE habit_id=? AND day=?',
        id,
        day,
      );
    else await tx.runAsync('INSERT INTO checkins VALUES(?,?)', id, day);
  });
}
export async function archiveHabit(db: SQLiteDatabase, id: string) {
  await db.runAsync('UPDATE habits SET archived=1-archived WHERE id=?', id);
}
