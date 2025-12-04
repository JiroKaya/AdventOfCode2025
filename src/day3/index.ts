import { Day } from "../day";

class Day3 extends Day {
  constructor() {
    super(3);
  }

  solveForPartOne(input: string): string {
    const data = input.split(/\r?\n|\r|\n/g);
    let numList: number[] = [];

    data.forEach((element) => {
      const numArray: number[] = Array.from(element, Number);

      const firstSearchArray = numArray.slice(0, -1);

      const biggestNum = Math.max(...firstSearchArray);
      const position = numArray.indexOf(biggestNum);

      const remainingArray = numArray.slice(position + 1);
      let nextBiggestNumber: number | undefined;

      nextBiggestNumber = Math.max(...remainingArray);

      const combinedNum = biggestNum.toString() + nextBiggestNumber.toString();
      numList.push(Number(combinedNum));
    });

    const sum: number = numList.reduce(
      (sumCurrent, currentValue) => sumCurrent + currentValue,
      0
    );
    return String(sum);
  }

  solveForPartTwo(input: string): string {
    const data = input.split(/\r?\n|\r|\n/g);
    let numList: number[] = [];

    const TARGET_DIGITS = 12;

    data.forEach((element) => {
      const numArray: number[] = Array.from(element, Number);

      if (numArray.length < TARGET_DIGITS) {
        return;
      }

      let digitsToDrop = numArray.length - TARGET_DIGITS;
      let result: number[] = [];

      for (const digit of numArray) {
        // still have digits we are allowed to drop
        // result list is not empty
        // current digit is greater than the last digit selected)
        while (
          digitsToDrop > 0 &&
          result.length > 0 &&
          digit > result[result.length - 1]
        ) {
          result.pop(); // Drop the smaller digit
          digitsToDrop--;
        }
        result.push(digit); // Append the current digit
      }

      while (digitsToDrop > 0) {
        result.pop();
        digitsToDrop--;
      }

      const combinedNum = result.slice(0, TARGET_DIGITS).join("");
      numList.push(Number(combinedNum));
    });

    const sum: number = numList.reduce(
      (sumCurrent, currentValue) => sumCurrent + currentValue,
      0
    );
    return String(sum);
  }
}

export default new Day3();
