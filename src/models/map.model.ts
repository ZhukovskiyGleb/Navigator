export enum Direction {
    UP = 'Up',
    DOWN = 'Down',
    LEFT = 'Left',
    RIGHT = 'Right'
}

export interface PlayerPosition {
    row: number,
    col: number,
    direction: Direction
}

export interface ExitPosition {
    row: number,
    col: number
}

export class MapModel {
    private readonly WALL_SIGN = '#';
    private readonly EXIT_SIGN = '@';
    private readonly UP_SIGN = '^';
    private readonly DOWN_SIGN = 'v';
    private readonly LEFT_SIGN = '<';
    private readonly RIGHT_SIGN = '>';
    private readonly DIRECTION_SIGNS : {[key: string]: Direction} = {
        [this.UP_SIGN]:     Direction.UP,
        [this.DOWN_SIGN]:   Direction.DOWN,
        [this.LEFT_SIGN]:   Direction.LEFT,
        [this.RIGHT_SIGN]:  Direction.RIGHT
    };

    private _map: Array<Array<boolean>> = [];
    private _playerPosition?: PlayerPosition;
    private _exitPosition?: ExitPosition;

    public update(mapText: string | null): boolean {
        if (!mapText || mapText.length === 0) return false;

        this.clear();

        let maxRowLength: number = this.parseMap(mapText);

        this.fillEmptySpaces(maxRowLength);

        return this.checkParseResults();
    }

    private parseMap(mapText: string): number {
        let maxRowLength: number = 0;

        mapText.split('\n')
            .forEach((row: string, i: number) => {
                this._map[i] = new Array<boolean>();

                maxRowLength = Math.max(maxRowLength, row.length);

                if (row.length > 0) {
                    row.split('')
                        .forEach((sign: string, j: number) => {
                            if (sign === this.WALL_SIGN) {
                                this._map[i][j] = false;
                            } else {
                                this._map[i][j] = true;

                                if (this.DIRECTION_SIGNS.hasOwnProperty(sign)) {
                                    if (this._playerPosition) {
                                        console.log('Warning: Player position duplication!');
                                    }
                                    this._playerPosition = {
                                        row: i,
                                        col: j,
                                        direction: this.DIRECTION_SIGNS[sign]
                                    };
                                } else if (sign === this.EXIT_SIGN) {
                                    if (this._exitPosition) {
                                        console.log('Warning: Exit position duplication!');
                                    }
                                    this._exitPosition = {
                                        row: i,
                                        col: j
                                    };
                                }
                            }
                        });
                }
            });

        return maxRowLength;
    }

    private fillEmptySpaces(maxRowLength: number): void {
        this._map.forEach((row: Array<boolean>) => {
            while (row.length < maxRowLength) {
                row.push(true);
            }
        });
    }

    private checkParseResults() {
        if (!this._playerPosition) {
            const keys = Object.keys({...this.DIRECTION_SIGNS});
            console.log(`Error: Player position [${keys}] not found!`);
            return false;
        }

        if (!this._exitPosition) {
            console.log(`Warning: Exit position [${this.EXIT_SIGN}] not found!`);
        }

        return true;
    }

    private clear(): void {
        this._map = new Array<Array<boolean>>();
        this._playerPosition = undefined;
        this._exitPosition = undefined;
    }

    public get content(): Array<Array<boolean>> {
        return this._map;
    }

    public get clone(): Array<Array<boolean>> {
        const clone = new Array<Array<boolean>>();
        this._map.forEach((row: Array<boolean>) => {
            clone.push([...row]);
        });
        return clone;
    }

    public get player(): PlayerPosition {
        return this._playerPosition || {
            row: 0,
            col: 0,
            direction: Direction.UP
        };
    }

    public get exit(): ExitPosition | undefined {
        return this._exitPosition;
    }

    public get height(): number {
        return this._map ? this._map.length : 0;
    }

    public get width(): number {
        return this._map && this._map[0] ? this._map[0].length : 0;
    }
}
