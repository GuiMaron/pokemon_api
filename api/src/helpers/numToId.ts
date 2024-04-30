export function numToId(num: string): number {
  return Number.parseInt(num);
}

export function numsToIds(nums: string[]): number[] {
  return (nums ?? []).map((num: string) => numToId(num));
}
