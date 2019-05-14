export enum Direction {
    UP = 1,
    DOWN = 2,
    LEFT = 3,
    RIGHT = 4
}

export interface PlayerPosition {
    posX: number,
    posY: number,
    direction: Direction
}

export class MapModel {
    private readonly WALL_SIGN = '#';
    private readonly DIRECTION_SIGNS : {[key: string]: Direction} = {
      '^': Direction.UP,
      '_': Direction.DOWN,
      '<': Direction.LEFT,
      '>': Direction.RIGHT
    };

    private _map: Array<Array<boolean>> = [];

    public init(mapText: string): PlayerPosition | null {
        if (!mapText) return null;

        this._map = new Array<Array<boolean>>();
        let playerPosition: PlayerPosition | null = null;

        mapText.split('\n')
            .forEach((row: string, i: number) => {
                this._map[i] = new Array<boolean>();

                row.split('')
                    .forEach((sign: string, j: number) => {
                        if (sign === this.WALL_SIGN) {
                            this._map[i][j] = false;
                        }
                        else {
                            this._map[i][j] = true;

                            if (this.DIRECTION_SIGNS.hasOwnProperty(sign)) {
                                if (playerPosition) {
                                    console.log('Warning! Player position duplication!');
                                }
                                playerPosition = {
                                    posX: i,
                                    posY: j,
                                    direction: this.DIRECTION_SIGNS[sign]
                                };
                            }
                        }
                    });
            });

        if (!playerPosition) {
            return null;
        }

        return playerPosition;
    }

    public get map(): Array<Array<boolean>> {
        return this._map;
    }

    public get height(): number {
        return this._map ? this._map.length : 0;
    }

    public get width(): number {
        return this._map && this._map[0] ? this._map[0].length : 0;
    }
}
