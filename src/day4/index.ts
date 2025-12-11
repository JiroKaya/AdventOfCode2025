import { Day } from "../day";

interface Point {
  r: number;
  c: number;
}

class Day4 extends Day {
  constructor() {
    super(4);
  }

  private getInitialState(input: string) {
    // Parse the input string into a 2D array
    const grid = input
      .trim()
      .split("\n")
      .map((line) => line.trim().split(""));
    const rows = grid.length;
    const cols = grid[0].length;

    // Initialize a 2D array to store the neighbor counts for each cell.
    const counts = Array.from({ length: rows }, () => Array(cols).fill(0));

    // Iterate through every cell in the grid.
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Only calculate the neighbor count if the current cell is a state/value we care about (represented by "@").
        if (grid[r][c] === "@") {
          let count = 0;

          // Use the helper method to iterate over the 8 neighbors of the current cell (r, c).
          this.forEachNeighbor(r, c, rows, cols, (nr, nc) => {
            // If a neighbor is also "@", increment the count.
            if (grid[nr][nc] === "@") count++;
          });

          // Store the total count of "@" neighbors for this cell.
          counts[r][c] = count;
        }
      }
    }
    // Return the initial grid and the calculated initial neighbor counts.
    return { grid, counts };
  }

  private forEachNeighbor(
    r: number,
    c: number,
    rows: number,
    cols: number,
    callback: (nr: number, nc: number) => void
  ) {
    // Iterate over possible row offsets (-1, 0, 1).
    for (let dr = -1; dr <= 1; dr++) {
      // Iterate over possible column offsets (-1, 0, 1).
      for (let dc = -1; dc <= 1; dc++) {
        // Skip the current cell itself (when both offsets are 0).
        if (dr === 0 && dc === 0) continue;

        // Calculate the neighbor's coordinates.
        const nr = r + dr;
        const nc = c + dc;

        // Check if the neighbor's coordinates are within the grid boundaries.
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          // If the coordinates are valid, execute the callback function with the neighbor's coordinates.
          callback(nr, nc);
        }
      }
    }
  }

  solveForPartOne(input: string): string {
    const { grid, counts } = this.getInitialState(input);
    let accessibleCount = 0;

    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[0].length; c++) {
        // If it's a roll and has < 4 neighbors
        if (grid[r][c] === "@" && counts[r][c] < 4) {
          accessibleCount++;
        }
      }
    }
    return String(accessibleCount);
  }

  solveForPartTwo(input: string): string {
    const { grid, counts } = this.getInitialState(input);
    const rows = grid.length;
    const cols = grid[0].length;

    // Identify initial removable rolls
    const todo: Point[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === "@" && counts[r][c] < 4) {
          todo.push({ r, c });
        }
      }
    }

    let totalRemoved = 0;

    while (todo.length > 0) {
      const { r, c } = todo.pop()!;

      // If already processed/removed, skip
      if (grid[r][c] !== "@") continue;

      // Remove the roll
      grid[r][c] = ".";
      totalRemoved++;

      // Update the 8 neighbors
      this.forEachNeighbor(r, c, rows, cols, (nr, nc) => {
        if (grid[nr][nc] === "@") {
          counts[nr][nc]--; // Neighbor lost a connection

          // If this neighbor JUST became removable (dropped to 3), add to todo
          if (counts[nr][nc] === 3) {
            todo.push({ r: nr, c: nc });
          }
        }
      });
    }

    return String(totalRemoved);
  }
}

export default new Day4();
