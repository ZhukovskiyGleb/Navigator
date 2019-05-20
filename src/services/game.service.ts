import {ControlsService, StartStates} from "./controls.service";
import {LoggerService} from "./logger.service";
import {MapEditService} from "./map-edit.service";
import {Injectable, Injector} from "../utils/injector.util";
import {MapView} from "../views/map.view";
import {Direction, PlayerPosition} from "../models/map.model";
import {Cell, isEqual, setEqual} from "../utils/utils";

export class GameService implements Injectable {
    private readonly GAME_BEGIN_MESSAGE = 'Game begins!';
    private readonly AMOUNT_PLACEHOLDER = '{amount}';
    private readonly MOVE_FORWARD_MESSAGE = `Move forward ${this.AMOUNT_PLACEHOLDER} steps.`;
    private readonly TURN_LEFT_MESSAGE = `Turn left and`;
    private readonly TURN_RIGHT_MESSAGE = `Turn right and`;
    private readonly TURN_AROUND_MESSAGE = `Turn around and`;
    private readonly EXIT_MESSAGE = `Exit!`;

    private readonly DIRECTION_ANGLES = {
        [Direction.UP]:     0,
        [Direction.DOWN]:   180,
        [Direction.LEFT]:   -90,
        [Direction.RIGHT]:  90
    };
    private readonly ANGLES_MAP: Array<{angle: number, power: number, msg: string}> = [
        {angle: 180, power: 2, msg: this.TURN_AROUND_MESSAGE},
        {angle: 90, power: 1, msg: this.TURN_RIGHT_MESSAGE},
        {angle: -90, power: -1, msg: this.TURN_LEFT_MESSAGE}
    ];
    private readonly DIRECTION_SEQUENCE = [
        Direction.UP, Direction.RIGHT, Direction.DOWN, Direction.LEFT
    ];


    private _controlsService: ControlsService = Injector.get(ControlsService) as ControlsService;
    private _loggerService: LoggerService = Injector.get(LoggerService) as LoggerService;
    private _mapService: MapEditService = Injector.get(MapEditService) as MapEditService;
    private _mapView: MapView = Injector.get(MapView) as MapView;

    private _player?: PlayerPosition;
    private _path: Array<Cell> = [];
    private _isGameStarted?: boolean;
    private _timer?: number;

    constructor() {
        this._controlsService.subscribeStartClick(this.onStartClick.bind(this));

        this.stopGame();
    }

    private onStartClick(): void {
        this.togglePlayMode(!this._isGameStarted);
    }

    private togglePlayMode(value: boolean): void {
        if (this._isGameStarted === value) {
            return;
        }

        this._isGameStarted = value;

        if (this._isGameStarted) {
            this.startGame();
        }
        else {
            this.stopGame();
        }
    }

    private startGame(): void {
        this._controlsService.deactivateEditButton();
        this._controlsService.switchStartState(StartStates.STOP);

        this._loggerService.clear();
        this._mapView.updateMap();

        this._player = this._mapService.playerClone;
        this._mapView.movePlayer(this._player, false);

        this._path = this._mapService.pathClone;

        this._loggerService.log(this.GAME_BEGIN_MESSAGE);

        this.nextStep();
    }

    public stopGame(): void {
        this._controlsService.activateEditButton();
        this._controlsService.switchStartState(StartStates.PLAY);

        if (this._timer) {
            clearTimeout(this._timer);
        }
    }

    private nextStep(): void {
        this._timer = setTimeout(() => {
            if (!this._player) return;

            let targetCell: Cell = {row: 0, col: 0};

            let {steps, targetAngle} = this.calculateNextStepParams(targetCell);

            this.movePlayer(targetCell, steps, targetAngle);

            if (isEqual(this._player, targetCell)) {
                this.removePassedCells(steps);
            }
            else
                this._mapView.movePlayer(this._player);

            if (this._path.length > 0) {
                this.nextStep();
            }
            else {
                this._loggerService.log(this.EXIT_MESSAGE);
                this.togglePlayMode(false);
            }

        }, this._controlsService.stepDelay);
    }

    private calculateNextStepParams(targetCell: Cell): {steps: number, targetAngle: number} {
        let steps = 0;
        let targetAngle = 0;

        do {
            setEqual(targetCell, this._path[steps]);

            targetAngle = this.calculateAngle(targetCell);
            if (targetAngle === 0) {
                steps ++;
            }
        } while (targetAngle === 0 && this._path.length > steps);

        return {steps, targetAngle};
    }

    private movePlayer(targetCell: Cell, steps: number, targetAngle: number): void {
        if (steps > 0) {

            setEqual(targetCell, this._path[steps - 1]);

            this._loggerService.log(this.MOVE_FORWARD_MESSAGE.replace(this.AMOUNT_PLACEHOLDER, steps.toString()));
            this.switchPosition(targetCell);
        }
        else {
            this._loggerService.log(this.getTurnMessage(targetAngle));
            this.switchDirection(targetAngle);
        }
    }

    private removePassedCells(steps: number):void {
        if (!this._player) return;

        steps = Math.max(1, steps);
        while (steps > 0) {
            this._mapView.movePlayer({
                ...this._path[0],
                direction: this._player.direction
            });
            this._path.shift();
            steps --;
        }
    }

    private calculateAngle(targetPos: Cell): number {
        if (this._player) {
            const row = targetPos.row - this._player.row;
            const col = targetPos.col - this._player.col;
            let angle = Math.atan2(row, col) * 180 / Math.PI + 90;

            if (angle > 90) {
                angle -= 360;
            }

            angle -= this.DIRECTION_ANGLES[this._player.direction];

            if (angle < -90) {
                angle += 360;
            }

            return angle;
        }
        return 0;
    }

    private switchPosition(target: Cell): void {
        if (this._player) {
            this._player.row = target.row;
            this._player.col = target.col;
        }
    }

    private switchDirection(angle: number): void {
        if (this._player) {
            let position = this.DIRECTION_SEQUENCE.indexOf(this._player.direction);
            position = position + this.getTurnPower(angle);

            if (position >= this.DIRECTION_SEQUENCE.length)
                position -= this.DIRECTION_SEQUENCE.length;

            if (position < 0)
                position += this.DIRECTION_SEQUENCE.length;

            this._player.direction = this.DIRECTION_SEQUENCE[position];
        }
    }

    private getTurnPower(angle: number): number {
        let power = 0;
        this.ANGLES_MAP.some((value: {angle: number, power: number}) => {
            if (angle >= value.angle) {
                power = value.power;
                return true;
            }
            return false;
        });
        return power;
    }

    private getTurnMessage(angle: number): string {
        let result = 'Fail!';
        this.ANGLES_MAP.some((value: {angle: number, msg: string}) => {
            if (angle >= value.angle) {
                result = value.msg;
                return true;
            }
            return false;
        });
        return result;
    }


}
