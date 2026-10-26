import type { SQLiteDatabase } from 'expo-sqlite';
import type { Task } from '../types/models';
import { title, date } from '../utils/validation';
import { dayKey } from '../utils/dates';
export async function saveTask(db: SQLiteDatabase, task: Task) {
  await db.runAsync(
    `INSERT INTO tasks VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title,notes=excluded.notes,priority=excluded.priority,due=excluded.due`,
    task.id,
    title(task.title),
    task.notes,
    task.priority,
    date(task.due),
    task.done,
    task.completed_on,
    task.created_at,
  );
}
export async function toggleTask(db: SQLiteDatabase, id: string) {
  await db.runAsync(
    'UPDATE tasks SET completed_on=CASE WHEN done=0 THEN ? ELSE NULL END,done=1-done WHERE id=?',
    dayKey(),
    id,
  );
}
export async function deleteTask(db: SQLiteDatabase, id: string) {
  await db.runAsync('DELETE FROM tasks WHERE id=?', id);
}
