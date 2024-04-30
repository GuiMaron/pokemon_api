import { MAX_NUM_LENGTH } from '../constants';

export function idToNum(id: number): string {
  return `${id}`.padStart(MAX_NUM_LENGTH, '0');
}

export function idsToNums(ids: number[]): string[] {
  return (ids ?? []).map((id: number) => idToNum(id));
}
