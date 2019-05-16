import {ControlsService, StartStates} from "./controls.service";
import {LoggerService} from "./logger.service";
import {MapEditService} from "./map-edit.service";
import {Injectable, Injector} from "../utils/injector.util";
import {MapView} from "../views/map.view";
import {Direction, PlayerPosition} from "../models/map.model";
import {Cell, isEqual} from "../utils/utils";

export class GameService implements Injectable {
    private readonly STEP_TIME: number = 1000;
    private readonly DIRECTION_ANGLES = {
        [Direction.UP]:     0,
        [Direction.DOWN]:   180,
        [Direction.LEFT]:   270,
        [Direction.RIGHT]:  90
    };

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
            this._loggerService.clear();
            this._player = this._mapService.playerClone;
            this._path = this._mapService.pathClone;

            this._loggerService.log('Game begins!');

            this._controlsService.deactivateEditButton();
            this._controlsService.switchStartState(StartStates.STOP);

            this.nextStep();
        }
        else {
            this._controlsService.activateEditButton();
            this._controlsService.switchStartState(StartStates.PLAY);

            if (this._timer) {
                clearTimeout(this._timer);
            }
        }
    }

    private nextStep(): void {
        this._timer = setTimeout(() => {



        }, this.STEP_TIME);
    }

    public stopGame(): void {
        this.togglePlayMode(false);
    }


}
