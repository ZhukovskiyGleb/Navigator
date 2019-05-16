export interface Cell {
    col: number,
    row: number
}

export function isContains(map: Array<Array<boolean | number>>, pos: Cell): boolean {
    return (pos.row >= 0 && pos.row < map.length &&
        pos.col >= 0 && pos.col < map[pos.row].length);
}

export function isExit(map: Array<Array<boolean | number>>, pos: Cell): boolean {
    return (pos.row === 0 || pos.row === map.length - 1 ||
        pos.col === 0 || (map.length > pos.row && pos.col === map[pos.row].length - 1));
}

export function isEqual(origin: Cell, target: Cell): boolean {
    return (origin.row === target.row && origin.col === target.col);
}
