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

export type Cell = { value: CellValue; state: CellState };

export enum Face {
  default = "😊",
  clicked = "😯",
  lost = "😵",
  win = "😎",
}
