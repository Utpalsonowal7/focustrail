import type { Checkin,Session,Task } from '../../types/models';
import { dayKey,shiftDay,weekDays } from '../../utils/dates';
export function streak(id:string,logs:Checkin[],today=dayKey()) { const days=new Set(logs.filter(l=>l.habit_id===id).map(l=>l.day)); let cursor=days.has(today)?today:shiftDay(today,-1),count=0; while(days.has(cursor)){count++;cursor=shiftDay(cursor,-1);} return count; }
export function totalMinutes(sessions:Session[],day:string) { return Math.floor(sessions.filter(s=>s.day===day).reduce((a,s)=>a+s.seconds,0)/60); }
export function weekly(sessions:Session[],today=dayKey()) { return weekDays(today).map(day=>({day,minutes:totalMinutes(sessions,day)})); }
export function completedToday(tasks:Task[],today=dayKey()) { return tasks.filter(t=>t.done&&t.completed_on===today).length; }
