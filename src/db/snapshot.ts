import type { SQLiteDatabase } from 'expo-sqlite';
import type { Task,Habit,Checkin,Session,Timer,Snapshot } from '../types/models';
import { readSettings } from './settings';
export async function snapshot(db:SQLiteDatabase):Promise<Snapshot> { const [tasks,habits,checkins,sessions,timer,settings]=await Promise.all([db.getAllAsync<Task>("SELECT * FROM tasks ORDER BY done, CASE priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END,created_at DESC"),db.getAllAsync<Habit>('SELECT * FROM habits ORDER BY created_on,id'),db.getAllAsync<Checkin>('SELECT * FROM checkins'),db.getAllAsync<Session>('SELECT * FROM sessions ORDER BY ended_at DESC'),db.getFirstAsync<Timer>('SELECT * FROM timer'),readSettings(db)]);return {tasks,habits,checkins,sessions,timer,settings}; }
