import type { SQLiteDatabase } from 'expo-sqlite';
import { schema } from './schema';
export async function migrate(db: SQLiteDatabase) {
  await db.execAsync(
    'PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;',
  );
  const v = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version',
  );
  if ((v?.user_version ?? 0) > 1)
    throw Error('This database needs a newer version of FocusTrail.');
  if (!v?.user_version)
    await db.withExclusiveTransactionAsync(async (tx) => {
      await tx.execAsync(schema);
      await tx.execAsync('PRAGMA user_version=1');
    });
}
