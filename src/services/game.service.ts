import {ControlsService, StartStates} from "./controls.service";
import {LoggerService} from "./logger.service";
import {MapEditService} from "./map-edit.service";

export class GameService {
    private readonly STEP_TIME: number = 1000;

    private _isGameStarted?: boolean;
    private _timer?: number;

    constructor(private _controlsService: ControlsService,
                private _loggerService: LoggerService,
                private _mapService: MapEditService) {
        this._controlsService.subscribeStartClick(this.onStartClick.bind(this));

        this.togglePlayMode(false);
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
            this._loggerService.log('Game begins!');

            this._controlsService.deactivateEditButton();
            this._controlsService.switchStartState(StartStates.PAUSE);

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

            // this._loggerService.log();

            this.nextStep();

        }, this.STEP_TIME);
    }

    public stopGame(): void {
        this.togglePlayMode(false);
    }
}
