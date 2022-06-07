import * as React from "react";
import { useState, useEffect } from "react";
import { generateCells } from "../../utils";
import Button from "../Button";
import "./App.scss";
import NumberDisplay from "../NumberDisplay";

const App: React.FC = () => {
  const [cells, setCells] = useState(generateCells());

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <Button
          key={`${rowIndex}-${colIndex}`}
          state={cell.state}
          value={cell.value}
          row={rowIndex}
          col={colIndex}
        />
      ))
    );
  };

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={0} />
        <div className="Face">😊</div>
        <NumberDisplay value={23} />
      </div>
      <div className="Body">{renderCells()}</div>
    </div>
  );
};

export default App;
