import { validDay } from './dates';
export function title(value: string) {
  const clean = value.trim();
  if (!clean || clean.length > 120)
    throw Error('Enter a title between 1 and 120 characters.');
  return clean;
}
export function date(value: string) {
  if (value && !validDay(value)) throw Error('Use a valid date: YYYY-MM-DD.');
  return value;
}
export function minutes(value: string | number, max = 180) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > max)
    throw Error(`Enter a whole number from 1 to ${max}.`);
  return n;
}
