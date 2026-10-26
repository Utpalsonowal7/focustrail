import type { SQLiteDatabase } from 'expo-sqlite';
import type { Timer } from '../types/models';
import { dayKey } from '../utils/dates';
import { remaining } from '../utils/timer';
export async function startTimer(db:SQLiteDatabase,id:string,seconds:number,kind:Timer['kind'],taskId:string|null) { await db.runAsync('INSERT INTO timer VALUES(1,?,?,?,?,?,?)',id,taskId,seconds,seconds,Date.now()+seconds*1000,kind); }
export async function pauseTimer(db:SQLiteDatabase,t:Timer) { await db.runAsync('UPDATE timer SET remaining=?,deadline=NULL WHERE id=?',remaining(t),t.id); }
export async function resumeTimer(db:SQLiteDatabase,t:Timer) { await db.runAsync('UPDATE timer SET deadline=? WHERE id=?',Date.now()+t.remaining*1000,t.id); }
export async function finishTimer(db:SQLiteDatabase,now=Date.now()) { await db.withExclusiveTransactionAsync(async tx=>{ const t=await tx.getFirstAsync<Timer>('SELECT * FROM timer WHERE slot=1'); if(!t||t.deadline===null||remaining(t,now)>0)return; if(t.kind==='focus') await tx.runAsync('INSERT OR IGNORE INTO sessions VALUES(?,?,?,?,?)',t.id,t.task_id,t.duration,dayKey(new Date(t.deadline)),t.deadline); await tx.runAsync('DELETE FROM timer WHERE id=?',t.id); }); }
export async function discardTimer(db:SQLiteDatabase) { await db.runAsync('DELETE FROM timer'); }
