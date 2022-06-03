let MAX_ROW = 9;
let MAX_COL = 9;

export enum CellValue {
  none,
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  bomb,
}

export enum CellState {
  open,
  clicked,
  flagged,
}

export type Cell = { value: CellValue; state: CellState };

export const generateCells = () => {
  const cells: Cell[][] = [];

  for (let row = 0; row < MAX_ROW; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COL; col++) {
      cells[row].push({
        value: CellValue.none,
        state: CellState.open,
      });
    }
  }
  return cells;
};
