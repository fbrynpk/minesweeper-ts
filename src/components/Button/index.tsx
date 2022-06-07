import * as React from "react";
import { CellState, CellValue } from "../../types";
import "./Button.scss";

interface ButtonProps {
  row: number;
  col: number;
  state: CellState;
  value: CellValue;
}

const Button: React.FC<ButtonProps> = ({ row, col, state, value }) => {
  const renderContent = (): React.ReactNode => {
    if (state === CellState.clicked) {
      if (value === CellValue.bomb) {
        return <span>💣</span>;
      } else if (value === CellValue.none) {
        return null;
      }
      return value;
    } else if (state === CellState.flagged) {
      return <span>🚩</span>;
    }

    return null;
  };

  return (
    <div
      className={`Button ${
        state === CellState.clicked ? "clicked" : ""
      } value-${value}`}
    >
      {renderContent()}
    </div>
  );
};

export default Button;
