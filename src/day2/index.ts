import { Day } from "../day";

class Day2 extends Day {
  constructor() {
    super(2);
  }

  solveForPartOne(input: string): string {
    const data = input.split(/\s*,\s*/);
    const allInvalidIds: number[] = [];
    const results: { element: string; invalidIds: number[] }[] = [];

    data.forEach((element) => {
      const invalidIds = findInvalidIdsInRange(element, 1);
      results.push({ element, invalidIds });
      allInvalidIds.push(...invalidIds);
    });

    const sum = allInvalidIds.reduce((sum, currentId) => sum + currentId, 0);
    return String(sum);
  }

  solveForPartTwo(input: string): string {
    const data = input.split(/\s*,\s*/);
    const allInvalidIds: number[] = [];
    const results: { element: string; invalidIds: number[] }[] = [];

    data.forEach((element) => {
      const invalidIds = findInvalidIdsInRange(element, 2);
      results.push({ element, invalidIds });
      allInvalidIds.push(...invalidIds);
    });

    const sum = allInvalidIds.reduce((sum, currentId) => sum + currentId, 0);
    return String(sum);
  }
}

function findInvalidIdsInRange(idRangeStr: string, part: number): number[] {
  const parts = idRangeStr.split("-");
  if (parts.length !== 2) {
    // Handle malformed input if necessary
    console.error(`Invalid range format: ${idRangeStr}`);
    return [];
  }

  const start = parseInt(parts[0], 10);
  const end = parseInt(parts[1], 10);

  // Basic validation
  if (isNaN(start) || isNaN(end) || start > end) {
    return [];
  }

  const invalidIds: number[] = [];

  // Iterate through all numbers in the range (inclusive)
  for (let i = start; i <= end; i++) {
    const validator =
      part === 1
        ? isInvalidId
        : part === 2
        ? isInvalidIdTwiceAppearance
        : () => false;

    if (validator(i)) {
      invalidIds.push(i);
    }
  }

  return invalidIds;
}

function isInvalidId(id: number): boolean {
  const idStr = String(id);
  const len = idStr.length;

  // The length must be even, as it's composed of a sequence repeated twice.
  if (len % 2 !== 0) {
    return false;
  }

  const halfLen = len / 2;
  const firstHalf = idStr.substring(0, halfLen);
  const secondHalf = idStr.substring(halfLen);

  // Check if the second half is identical to the first half.
  return firstHalf === secondHalf;
}

function isInvalidIdTwiceAppearance(id: number): boolean {
  const idStr = String(id);
  const len = idStr.length;

  // If a sequence repeats N>=2 times, the sequence length must be <= len / 2.
  for (let periodLen = 1; periodLen <= Math.floor(len / 2); periodLen++) {
    if (len % periodLen === 0) {
      const period = idStr.substring(0, periodLen);

      let reconstructed = "";
      const numRepeats = len / periodLen;

      for (let i = 0; i < numRepeats; i++) {
        reconstructed += period;
      }

      if (reconstructed === idStr) {
        return true; // Found a sequence that repeats
      }
    }
  }

  return false; // No repeating sequence found
}

export default new Day2();
