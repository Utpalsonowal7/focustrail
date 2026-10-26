import type { Timer } from '../types/models';
export function remaining(timer:Timer,now=Date.now()) { return timer.deadline===null?timer.remaining:Math.max(0,Math.min(timer.duration,Math.ceil((timer.deadline-now)/1000))); }
