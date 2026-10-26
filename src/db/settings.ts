import type { SQLiteDatabase } from 'expo-sqlite';
import type { Settings } from '../types/models';
import { minutes } from '../utils/validation';
export const defaults:Settings={name:'',focus:25,rest:5,goal:120};
export async function readSettings(db:SQLiteDatabase):Promise<Settings> { const row=await db.getFirstAsync<{value:string}>("SELECT value FROM settings WHERE key='preferences'"); return row?{...defaults,...JSON.parse(row.value)}:defaults; }
export async function saveSettings(db:SQLiteDatabase,s:Settings) { if(s.name.length>40)throw Error('Name must be 40 characters or fewer.'); const value={name:s.name.trim(),focus:minutes(s.focus),rest:minutes(s.rest,60),goal:minutes(s.goal,720)}; await db.runAsync("INSERT INTO settings VALUES('preferences',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",JSON.stringify(value)); }
