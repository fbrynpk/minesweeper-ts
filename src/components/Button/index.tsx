import * as React from "react";
import { CellState, CellStatus, CellValue } from "../../types";
import "./Button.scss";

interface ButtonProps {
  row: number;
  col: number;
  state: CellState;
  value: CellValue;
  status: CellStatus;
  lose?: boolean;
  onClick: (
    rowParam: number,
    colParam: number
  ) => React.MouseEventHandler<HTMLDivElement> | undefined;
  onContext: (
    rowParam: number,
    colParam: number
  ) => React.MouseEventHandler<HTMLDivElement> | undefined;
}

const Button: React.FC<ButtonProps> = ({
  row,
  col,
  state,
  value,
  status,
  lose,
  onClick,
  onContext,
}) => {
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
      onClick={onClick(row, col)}
      onContextMenu={onContext(row, col)}
      className={`Button ${state === CellState.clicked ? "clicked" : ""}
      ${status === CellStatus.finish ? "finish" : ""}
       value-${value} ${lose ? "lose" : ""}`}
    >
      {renderContent()}
    </div>
  );
};

export default Button;
