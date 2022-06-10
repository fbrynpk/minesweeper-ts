import {
  Cell,
  CellValue,
  CellState,
  CellProps,
  CellStatus,
} from "../types/index";

export let MAX_ROWS = 9;
export let MAX_COLS = 9;
export let NO_OF_BOMBS = 10;

export const grabAllAdjacent = (
  cells: Cell[][],
  rowParam: number,
  colParam: number
): CellProps => {
  const topLeftCell =
    rowParam > 0 && colParam > 0 ? cells[rowParam - 1][colParam - 1] : null;
  const topCell = rowParam > 0 ? cells[rowParam - 1][colParam] : null;
  const topRightCell =
    rowParam > 0 && colParam < MAX_COLS - 1
      ? cells[rowParam - 1][colParam + 1]
      : null;
  const leftCell = colParam > 0 ? cells[rowParam][colParam - 1] : null;
  const rightCell =
    colParam < MAX_COLS - 1 ? cells[rowParam][colParam + 1] : null;
  const bottomLeftCell =
    rowParam < MAX_ROWS - 1 && colParam > 0
      ? cells[rowParam + 1][colParam - 1]
      : null;
  const bottomCell =
    rowParam < MAX_ROWS - 1 ? cells[rowParam + 1][colParam] : null;
  const bottomRightCell =
    rowParam < MAX_ROWS - 1 && colParam < MAX_COLS - 1
      ? cells[rowParam + 1][colParam + 1]
      : null;

  return {
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell,
  };
};

//Generate Cells
export const generateCells = (): Cell[][] => {
  let cells: Cell[][] = [];

  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLS; col++) {
      cells[row].push({
        value: CellValue.none,
        state: CellState.open,
        status: CellStatus.alive,
      });
    }
  }

  //Put Random Bombs
  let bombsPlaced = 0;
  while (bombsPlaced < NO_OF_BOMBS) {
    const randRow = Math.floor(Math.random() * MAX_ROWS);
    const randCol = Math.floor(Math.random() * MAX_COLS);

    const currentCell = cells[randRow][randCol];
    if (currentCell.value !== CellValue.bomb) {
      cells = cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (randRow === rowIndex && randCol === colIndex)
            return {
              ...cell,
              value: CellValue.bomb,
            };
          return cell;
        })
      );
      bombsPlaced++;
    }
  }

  //Calculate Numbers for each cell
  for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
    for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
      const currentCell = cells[rowIndex][colIndex];
      if (currentCell.value === CellValue.bomb) {
        continue;
      }

      let numberOfBombs = 0;
      const {
        topCell,
        topLeftCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomCell,
        bottomLeftCell,
        bottomRightCell,
      } = grabAllAdjacent(cells, rowIndex, colIndex);

      if (topLeftCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (topCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (topRightCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (leftCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (rightCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (bottomLeftCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (bottomCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (bottomRightCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }

      if (numberOfBombs > 0) {
        cells[rowIndex][colIndex] = {
          ...currentCell,
          value: numberOfBombs,
        };
      }
    }
  }

  return cells;
};

export const checkAroundCell = (
  cells: Cell[][],
  rowParam: number,
  colParam: number
): Cell[][] => {
  let slicedCell = cells.slice();

  slicedCell[rowParam][colParam].state = CellState.clicked;

  const {
    topCell,
    topLeftCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomCell,
    bottomLeftCell,
    bottomRightCell,
  } = grabAllAdjacent(cells, rowParam, colParam);

  if (
    topLeftCell?.state === CellState.open &&
    topLeftCell.value !== CellValue.bomb
  ) {
    if (topLeftCell.value === CellValue.none) {
      slicedCell = checkAroundCell(slicedCell, rowParam - 1, colParam - 1);
    } else {
      slicedCell[rowParam - 1][colParam - 1].state = CellState.clicked;
    }
  }
  if (topCell?.state === CellState.open && topCell.value !== CellValue.bomb) {
    if (topCell.value === CellValue.none) {
      slicedCell = checkAroundCell(slicedCell, rowParam - 1, colParam);
    } else {
      slicedCell[rowParam - 1][colParam].state = CellState.clicked;
    }
  }
  if (
    topRightCell?.state === CellState.open &&
    topRightCell.value !== CellValue.bomb
  ) {
    if (topRightCell.value === CellValue.none) {
      slicedCell = checkAroundCell(slicedCell, rowParam - 1, colParam + 1);
    } else {
      slicedCell[rowParam - 1][colParam + 1].state = CellState.clicked;
    }
  }
  if (leftCell?.state === CellState.open && leftCell.value !== CellValue.bomb) {
    if (leftCell.value === CellValue.none) {
      slicedCell = checkAroundCell(slicedCell, rowParam, colParam - 1);
    } else {
      slicedCell[rowParam][colParam - 1].state = CellState.clicked;
    }
  }
  if (
    rightCell?.state === CellState.open &&
    rightCell.value !== CellValue.bomb
  ) {
    if (rightCell.value === CellValue.none) {
      slicedCell = checkAroundCell(slicedCell, rowParam, colParam + 1);
    } else {
      slicedCell[rowParam][colParam + 1].state = CellState.clicked;
    }
  }
  if (
    bottomCell?.state === CellState.open &&
    bottomCell.value !== CellValue.bomb
  ) {
    if (bottomCell.value === CellValue.none) {
      slicedCell = checkAroundCell(slicedCell, rowParam + 1, colParam);
    } else {
      slicedCell[rowParam + 1][colParam].state = CellState.clicked;
    }
  }
  if (
    bottomLeftCell?.state === CellState.open &&
    bottomLeftCell.value !== CellValue.bomb
  ) {
    if (bottomLeftCell.value === CellValue.none) {
      slicedCell = checkAroundCell(slicedCell, rowParam + 1, colParam - 1);
    } else {
      slicedCell[rowParam + 1][colParam - 1].state = CellState.clicked;
    }
  }
  if (
    bottomRightCell?.state === CellState.open &&
    bottomRightCell.value !== CellValue.bomb
  ) {
    if (bottomRightCell.value === CellValue.none) {
      slicedCell = checkAroundCell(slicedCell, rowParam + 1, colParam + 1);
    } else {
      slicedCell[rowParam + 1][colParam + 1].state = CellState.clicked;
    }
  }

  return slicedCell;
};
