export enum CellValue {
  none, //0
  one, //1
  two, //2
  three, //3
  four, //4
  five, //5
  six, //6
  seven, //7
  eight, //8
  bomb, //9
}

export enum CellState {
  open,
  clicked,
  flagged,
}

export type Cell = { value: CellValue; state: CellState; lose?: boolean };

export enum Face {
  default = "😊",
  clicked = "😯",
  lost = "😵",
  win = "😎",
}

export type CellProps = {
  topLeftCell: Cell | null;
  topCell: Cell | null;
  topRightCell: Cell | null;
  leftCell: Cell | null;
  rightCell: Cell | null;
  bottomLeftCell: Cell | null;
  bottomCell: Cell | null;
  bottomRightCell: Cell | null;
};
