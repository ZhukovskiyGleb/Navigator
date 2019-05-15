export interface Cell {
    col: number,
    row: number
}

export class PathFinder {

    private static readonly DIRECTIONS: Array<[number, number]> = [
        [1,  0],
        [-1, 0],
        [0,  1],
        [0, -1]
    ];

    public static find(map: Array<Array<boolean>>, startPos: Cell, endPos?: Cell):Array<Cell> {
        const pathMap = new Array<Array<number | boolean>>();

        map.forEach((row: Array<boolean>) => {
            pathMap.push([...row]);
        });

        let currentPos: Cell = {
            row: startPos.row,
            col: startPos.col
        };
        let targetPos: Cell;
        const nextSteps = new Array<Cell>();
        pathMap[currentPos.row][currentPos.col] = 0;

        let pathFound: boolean = false;

        while (true) {
            this.DIRECTIONS.forEach((direction: [number, number]) => {
                targetPos = {
                    row: currentPos.row + direction[0],
                    col: currentPos.col + direction[1]
                };
                if (this.isContains(pathMap, targetPos) && pathMap[targetPos.row][targetPos.col] === true) {
                    pathMap[targetPos.row][targetPos.col] = <number>pathMap[currentPos.row][currentPos.col] + 1;
                    nextSteps.push(targetPos);

                    if ((endPos && this.isEqual(targetPos, endPos)) ||
                        (!endPos && this.isExit(pathMap, targetPos))) {

                        endPos = targetPos;
                        pathFound = true;
                        return;
                    }
                }
            });

            if (pathFound || nextSteps.length === 0) {
                break;
            }
            else {
                currentPos = <Cell>nextSteps.shift();
            }
        }

        nextSteps.length = 0;

        if (!pathFound) {
            pathMap.length = 0;

            return  [];
        }

        currentPos = endPos ? {
            row: endPos.row,
            col: endPos.col
        } : {
            row: startPos.row,
            col: startPos.col
        };

        const result = new Array<Cell>();

        while (true) {
            result.push(currentPos);

            if (this.isEqual(currentPos, startPos)) {
                break;
            }

            this.DIRECTIONS.forEach((direction: [number, number]) => {
                targetPos = {
                    row: currentPos.row + direction[0],
                    col: currentPos.col + direction[1]
                };

                if (this.isContains(pathMap, targetPos)) {
                    let value = pathMap[targetPos.row][targetPos.col];
                    if (typeof value === "number" && <number>value < pathMap[currentPos.row][currentPos.col]) {
                        currentPos = targetPos;
                        return;
                    }
                }
            });
        }

        pathMap.length = 0;

        return result;
    }

    private static isContains(map: Array<Array<boolean | number>>, pos: Cell): boolean {
        return (pos.row >= 0 && pos.row < map.length &&
            pos.col >= 0 && pos.col < map[pos.row].length);
    }

    private static isExit(map: Array<Array<boolean | number>>, pos: Cell): boolean {
        return (pos.row === 0 || pos.row === map.length - 1 ||
            pos.col === 0 || (map.length > pos.row && pos.col === map[pos.row].length - 1));
    }

    private static isEqual(origin: Cell, target: Cell): boolean {
        return (origin.row === target.row && origin.col === target.col);
    }
}
