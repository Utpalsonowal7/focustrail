import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { AppState } from 'react-native';
import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import type { Snapshot } from '../types/models';
import { snapshot } from '../db/snapshot';
import { finishTimer } from '../db/timer';
type State = {
  data: Snapshot | null;
  error: string;
  busy: boolean;
  run: (fn: (db: SQLiteDatabase) => Promise<unknown>) => Promise<boolean>;
  refresh: () => Promise<void>;
};
const Context = createContext<State | null>(null);
export function DataProvider({ children }: { children: React.ReactNode }) {
  const db = useSQLiteContext();
  const [data, setData] = useState<Snapshot | null>(null),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const refresh = useCallback(async () => {
    setData(await snapshot(db));
  }, [db]);
  const run = useCallback(
    async (fn: (db: SQLiteDatabase) => Promise<unknown>) => {
      if (lock.current) return false;
      lock.current = true;
      setBusy(true);
      try {
        await fn(db);
        await refresh();
        setError('');
        return true;
      } catch (e) {
        setError(
          e instanceof Error ? e.message : 'Could not save. Please try again.',
        );
        return false;
      } finally {
        lock.current = false;
        setBusy(false);
      }
    },
    [db, refresh],
  );
  useEffect(() => {
    void Promise.resolve().then(() => run(finishTimer));
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') void run(finishTimer);
    });
    return () => sub.remove();
  }, [run]);
  return (
    <Context.Provider value={{ data, error, busy, run, refresh }}>
      {children}
    </Context.Provider>
  );
}
export function useData() {
  const c = useContext(Context);
  if (!c) throw Error('DataProvider missing');
  return c;
}
