export type Task = {
  id: string;
  title: string;
  notes: string;
  priority: 'low' | 'medium' | 'high';
  due: string;
  done: number;
  completed_on: string | null;
  created_at: number;
};
export type Habit = {
  id: string;
  title: string;
  created_on: string;
  archived: number;
};
export type Checkin = { habit_id: string; day: string };
export type Session = {
  id: string;
  task_id: string | null;
  seconds: number;
  day: string;
  ended_at: number;
};
export type Timer = {
  id: string;
  task_id: string | null;
  duration: number;
  remaining: number;
  deadline: number | null;
  kind: 'focus' | 'break';
};
export type Settings = {
  name: string;
  focus: number;
  rest: number;
  goal: number;
};
export type Snapshot = {
  tasks: Task[];
  habits: Habit[];
  checkins: Checkin[];
  sessions: Session[];
  timer: Timer | null;
  settings: Settings;
};
