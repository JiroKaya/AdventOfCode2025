import { Day } from "../day";

interface NumberRange {
  min: number;
  max: number;
}

interface ParsedResult {
  ranges: NumberRange[];
  numbersToTest: number[];
}

class Day5 extends Day {
  constructor() {
    super(5);
  }

  solveForPartOne(input: string): string {
    const { ranges, numbersToTest } = parseRanges(input);
    const matchingNumbers = getIncludedNumbers(ranges, numbersToTest);

    return String(matchingNumbers.length);
  }

  solveForPartTwo(input: string): string {
    const { ranges } = parseRanges(input);
    const totalNumbers = countNumbersInRanges(ranges);

    return String(totalNumbers);
  }
}

function parseRanges(rangeText: string): ParsedResult {
  const rangeLines = rangeText.split("\n").filter((line) => line.trim() !== "");
  const rangeArray: NumberRange[] = [];
  const numbersArray: number[] = [];

  // 2. Map each range string into a NumberRange object
  rangeLines.forEach((line) => {
    if (line.includes("-")) {
      // This line looks like a RANGE (e.g., "3-5")
      const parts = line.split("-");

      const min = parseInt(parts[0], 10);
      const max = parseInt(parts[1], 10);

      // Basic validation
      if (!isNaN(min) && !isNaN(max) && parts.length === 2) {
        rangeArray.push({
          min: Math.min(min, max),
          max: Math.max(min, max),
        });
      } else {
        console.warn(`Skipping invalid range format: ${line}`);
      }
    } else {
      // This line looks like a single NUMBER (e.g., "4")
      const num = parseInt(line, 10);

      // Validation: must be a valid number
      if (!isNaN(num)) {
        numbersArray.push(num);
      } else {
        console.warn(`Skipping invalid number: ${line}`);
      }
    }
  });

  return {
    //ranges: rangeArray,
    ranges: rangeArray,
    numbersToTest: numbersArray,
  };
}

function getIncludedNumbers(
  ranges: NumberRange[],
  numbersToTest: number[]
): number[] {
  const mergedRanges = mergeRanges(ranges);
  return numbersToTest.filter((num) =>
    mergedRanges.some((range) => num >= range.min && num <= range.max)
  );
}

function countNumbersInRanges(ranges: NumberRange[]): number {
  const mergedRanges = mergeRanges(ranges);
  return mergedRanges.reduce((sum, r) => sum + (r.max - r.min + 1), 0);
}

function mergeRanges(ranges: NumberRange[]): NumberRange[] {
  if (ranges.length === 0) return [];

  const sorted = [...ranges].sort((a, b) => a.min - b.min);
  const merged: NumberRange[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const current = sorted[i];

    if (current.min <= last.max + 1) {
      last.max = Math.max(last.max, current.max);
    } else {
      merged.push({ ...current });
    }
  }

  return merged;
}

export default new Day5();
