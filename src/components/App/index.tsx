import * as React from "react";
import { useState, useEffect } from "react";
import {
  checkAroundCell,
  generateCells,
  MAX_COLS,
  MAX_ROWS,
} from "../../utils";
import Button from "../Button";
import "./App.scss";
import NumberDisplay from "../NumberDisplay";
import { Cell, CellState, CellValue, Face } from "../../types";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.default);
  const [time, setTime] = useState<number>(0);
  const [start, setStart] = useState<boolean>(false);
  const [flag, setFlag] = useState<number>(10);
  const [lost, setLost] = useState<boolean>(false);
  const [win, setWin] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseDown = (): void => {
      setFace(Face.clicked);
    };

    const handleMouseUp = (): void => {
      setFace(Face.default);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  useEffect(() => {
    if (start) {
      const timer = setInterval(() => {
        setTime(time + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [start, time]);

  useEffect(() => {
    if (win) {
      setStart(false);
      setFace(Face.win);
      setFlag(0);
    }
  }, [win]);

  useEffect(() => {
    if (lost) {
      setStart(false);
      setFace(Face.lost);
    }
  }, [lost]);

  const handleCellClick = (rowParam: number, colParam: number) => (): void => {
    let currentCell = cells[rowParam][colParam];
    let slicedCell = cells.slice();

    //Avoid clicking a bomb on first try
    if (!start) {
      while (currentCell.value === CellValue.bomb) {
        console.log("hit a bomb, regenerating cells", currentCell);
        slicedCell = generateCells();
        currentCell = slicedCell[rowParam][colParam];
      }
      setStart(true);
    }

    //Nothing happens when clicking a clicked cells or flagged cells
    if ([CellState.clicked, CellState.flagged].includes(currentCell.state)) {
      return;
    }

    //All clicking possibilities
    if (currentCell.value === CellValue.bomb) {
      setLost(true);
      slicedCell[rowParam][colParam].lose = true;
      slicedCell = showAllBombs();
      setCells(slicedCell);
    } else if (currentCell.value === CellValue.none) {
      slicedCell = checkAroundCell(slicedCell, rowParam, colParam);
      setCells(slicedCell);
    } else {
      slicedCell[rowParam][colParam].state = CellState.clicked;
      setCells(slicedCell);
    }

    //Check Win
    let SafeCellsExist = false;
    for (let row = 0; row < MAX_ROWS; row++) {
      for (let col = 0; col < MAX_COLS; col++) {
        const currentCell = slicedCell[row][col];

        if (
          currentCell.value !== CellValue.bomb &&
          currentCell.state === CellState.open
        ) {
          SafeCellsExist = true;
          break;
        }
      }
    }
    //Replace bomb cells with flagged cells
    if (!SafeCellsExist) {
      slicedCell = slicedCell.map((row) =>
        row.map((cell) => {
          if (cell.value === CellValue.bomb) {
            return {
              ...cell,
              state: CellState.flagged,
            };
          }
          return cell;
        })
      );
      setWin(true);
    }
    setCells(slicedCell);
  };

  const handleCellContext =
    (rowParam: number, colParam: number) =>
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      e.preventDefault();

      const currentCell = cells[rowParam][colParam];
      const slicedCell = cells.slice();

      if (currentCell.state === CellState.clicked) {
        return;
      } else if (currentCell.state === CellState.open) {
        slicedCell[rowParam][colParam].state = CellState.flagged;
        setCells(slicedCell);
        setFlag(flag - 1);
        setStart(true);
      } else if (currentCell.state === CellState.flagged) {
        slicedCell[rowParam][colParam].state = CellState.open;
        setCells(slicedCell);
        setFlag(flag + 1);
        setStart(true);
      }
    };

  const handleFaceClick = (): void => {
    setStart(false);
    setTime(0);
    setCells(generateCells());
    setFlag(10);
    setLost(false);
    setWin(false);
  };

  const showAllBombs = (): Cell[][] => {
    const currentCell = cells.slice();
    return currentCell.map((row) =>
      row.map((cell) => {
        if (cell.value === CellValue.bomb) {
          return {
            ...cell,
            state: CellState.clicked,
          };
        }
        return cell;
      })
    );
  };

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button
          key={`${rowIndex}-${colIndex}`}
          state={cell.state}
          value={cell.value}
          row={rowIndex}
          col={colIndex}
          onClick={handleCellClick}
          onContext={handleCellContext}
          lose={cell.lose}
        />
      ))
    );
  };

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={flag} />
        <div onClick={handleFaceClick} className="Face">
          {face}
        </div>
        <NumberDisplay value={time} />
      </div>
      <div className="Body">{renderCells()}</div>
    </div>
  );
};

export default App;
