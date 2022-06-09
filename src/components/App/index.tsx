import * as React from "react";
import { useState, useEffect } from "react";
import { generateCells } from "../../utils";
import Button from "../Button";
import "./App.scss";
import NumberDisplay from "../NumberDisplay";
import { Cell, CellState, Face } from "../../types";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells());
  const [face, setFace] = useState<Face>(Face.default);
  const [time, setTime] = useState<number>(0);
  const [start, setStart] = useState<boolean>(false);
  const [flag, setFlag] = useState<number>(10);

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

  const handleCellClick = () => (): void => {
    if (!start) {
      setStart(true);
    }
  };

  const handleCellContext =
    (rowParam: number, colParam: number) =>
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      e.preventDefault();

      const currentCell = cells[rowParam][colParam];
      const slicedCell = cells.slice();

      if (currentCell.state === CellState.clicked || !start) {
        return;
      } else if (currentCell.state === CellState.open || !start) {
        slicedCell[rowParam][colParam].state = CellState.flagged;
        setCells(slicedCell);
        setFlag(flag - 1);
      } else if (currentCell.state === CellState.flagged) {
        slicedCell[rowParam][colParam].state = CellState.open;
        setCells(slicedCell);
        setFlag(flag + 1);
      }
    };

  const handleFaceClick = (): void => {
    if (start) {
      setStart(false);
      setTime(0);
      setCells(generateCells());
      setFlag(10);
    }
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
