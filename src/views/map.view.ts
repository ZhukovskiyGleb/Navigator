import {Injectable} from "../utils/injector.util";
import {Direction, PlayerPosition} from "../models/map.model";

export class MapView implements Injectable{
    private readonly CELL_SIZE = 20;
    private readonly STEPS_IMG = 'images/steps.png';
    private readonly ARROW_IMG = 'images/arrow.png';
    private readonly DIRECTION_TRANSFORMS = {
        [Direction.UP]:     '',
        [Direction.DOWN]:   'transform: rotate(180deg)',
        [Direction.LEFT]:   'transform: rotate(270deg)',
        [Direction.RIGHT]:  'transform: rotate(90deg)'
    };

    private readonly _mapArea: HTMLDivElement;
    private _mapGrid: Array<Array<HTMLDivElement>> = [];
    private _playerPosition?: PlayerPosition;

    constructor() {
        this._mapArea = document.getElementById('map-area') as HTMLDivElement;
    }

    public buildMap(map: Array<Array<boolean>>, playerPos: PlayerPosition): void {
        this.clear();

        map.forEach((row: Array<boolean>, i: number) => {

            let rowDiv = <HTMLDivElement>document.createElement('div');
            rowDiv.className = 'grid-row';

            this._mapGrid[i] = new Array<HTMLDivElement>();

            row.forEach((isEmpty: boolean, j: number) => {
                let cellDiv = <HTMLDivElement>document.createElement('div');
                cellDiv.className = `grid-cell ${!isEmpty ? 'grid-wall' : ''}`;
                cellDiv.style.width = `${this.CELL_SIZE}px`;
                cellDiv.style.height = `${this.CELL_SIZE}px`;

                rowDiv.appendChild(cellDiv);

                this._mapGrid[i][j] = cellDiv;
            });
            this._mapArea.appendChild(rowDiv);
        });

        this.movePlayer(playerPos, false);

        this._mapArea.style.width = map.length ? (map[0].length) * this.CELL_SIZE + 'px' : '0px';
    }

    public clear(): void {
        this._mapGrid = new Array<Array<HTMLDivElement>>();

        this._mapArea.innerHTML = '';
    }

    public updateMap(): void {
        this._mapGrid.forEach((row: Array<HTMLDivElement>, i: number) => {
            row.forEach((div: HTMLDivElement, j: number) => {
                if (!this._playerPosition || this._playerPosition.row !== i || this._playerPosition.col !== j)
                    div.innerHTML = '';
            })
        })
    }

    public movePlayer(playerPos: PlayerPosition, leaveStep: boolean = true): void {
        let cell: HTMLDivElement;

        if (this._playerPosition && (this._playerPosition.row != playerPos.row || this._playerPosition.col != playerPos.col)) {
            cell = this._mapGrid[this._playerPosition.row][this._playerPosition.col];
            if (leaveStep)
                cell.innerHTML = `<img src="${this.STEPS_IMG}" width="${this.CELL_SIZE}" height="${this.CELL_SIZE}" style="opacity: 0.5; ${this.DIRECTION_TRANSFORMS[this._playerPosition.direction]}">`;
            else
                cell.innerHTML = '';
        }

        this._playerPosition = {
            row: playerPos.row,
            col: playerPos.col,
            direction: playerPos.direction
        };

        cell = this._mapGrid[this._playerPosition.row][this._playerPosition.col];
        cell.innerHTML = `<img src="${this.ARROW_IMG}" width="${this.CELL_SIZE}" height="${this.CELL_SIZE}" style="${this.DIRECTION_TRANSFORMS[this._playerPosition.direction]}">`;
    }
}
