import { Day } from "../day";

class Day1 extends Day {
  constructor() {
    super(1);
  }

  solveForPartOne(input: string): string {
    const parseInput = (input: string): string[] => {
      return input
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    };

    const startingPosition = 50;
    const targetNumber = 0;

    const moveSequence = parseInput(input);

    const finalPosition = processDialMoves(
      startingPosition,
      moveSequence,
      targetNumber
    );

    return finalPosition;
  }

  solveForPartTwo(input: string): string {
    const parseInput = (input: string): string[] => {
      return input
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    };

    const startingPosition = 50;
    const targetNumber = 0;

    const moveSequence = parseInput(input);

    const finalPosition = processDialMovesWithHitCount(
      startingPosition,
      moveSequence,
      targetNumber
    );

    return finalPosition;
  }
}

function processDialMoves(
  startPosition: number,
  moves: string[],
  targetNumber: number
): string {
  const DIAL_SIZE = 100;
  let currentPosition = startPosition % DIAL_SIZE;
  let hitsTargetNumber = 0;

  for (const move of moves) {
    const direction = move.charAt(0);
    const magnitude = parseInt(move.substring(1));

    if (isNaN(magnitude) || (direction !== "L" && direction !== "R")) {
      // Log an error but continue processing valid moves
      console.error(
        `Skipping invalid move format: ${move}. Move must be 'L' or 'R' followed by a number.`
      );
      continue;
    }

    let change = magnitude;

    if (direction === "L") {
      change = -magnitude;
    }

    let nextPosition =
      (((currentPosition + change) % DIAL_SIZE) + DIAL_SIZE) % DIAL_SIZE;

    if (nextPosition === targetNumber) {
      hitsTargetNumber++;
    }

    currentPosition = nextPosition;
  }

  return String(hitsTargetNumber);
}

function processDialMovesWithHitCount(
  startPosition: number,
  moves: string[],
  targetNumber: number
): string {
  const DIAL_SIZE = 100;
  let currentPosition = startPosition % DIAL_SIZE;
  let totalHitsTargetNumber = 0;

  for (const move of moves) {
    const direction = move.charAt(0);
    const magnitude = parseInt(move.substring(1));

    if (isNaN(magnitude) || (direction !== "L" && direction !== "R")) {
      console.error(
        `Skipping invalid move format: ${move}. Move must be 'L' or 'R' followed by a number.`
      );
      continue;
    }

    let change = magnitude;
    if (direction === "L") {
      change = -magnitude;
    }

    let hitsThisMove = 0;

    if (change > 0) {
      let distanceToTarget = targetNumber - currentPosition;
      if (distanceToTarget < 0) {
        distanceToTarget += DIAL_SIZE;
      }

      if (change >= distanceToTarget) {
        hitsThisMove = 1;

        let remainingChange = change - distanceToTarget;
        let fullCycleHits = Math.floor(remainingChange / DIAL_SIZE);

        hitsThisMove += fullCycleHits;
      }
    } else if (change < 0) {
      let absoluteChange = Math.abs(change);

      let backwardDistanceToTarget = currentPosition - targetNumber;
      if (backwardDistanceToTarget < 0) {
        backwardDistanceToTarget += DIAL_SIZE; // Distance to target wrapping around 99
      }

      if (absoluteChange >= backwardDistanceToTarget) {
        hitsThisMove = 1;

        let remainingChange = absoluteChange - backwardDistanceToTarget;
        let fullCycleHits = Math.floor(remainingChange / DIAL_SIZE);

        hitsThisMove += fullCycleHits;
      }
    }

    if (currentPosition === targetNumber && change !== 0) {
      hitsThisMove = hitsThisMove > 0 ? hitsThisMove - 1 : 0;

      if (change > 0) {
        hitsThisMove = Math.floor(change / DIAL_SIZE);
      } else if (change < 0) {
        hitsThisMove = Math.floor(Math.abs(change) / DIAL_SIZE);
      }
    }

    totalHitsTargetNumber += hitsThisMove;

    // Calculate the next position and update currentPosition for the next iteration
    let nextPosition =
      (((currentPosition + change) % DIAL_SIZE) + DIAL_SIZE) % DIAL_SIZE;
    currentPosition = nextPosition;
  }

  return String(totalHitsTargetNumber);
}

export default new Day1();
