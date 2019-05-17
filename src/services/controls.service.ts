import {Injectable} from "../utils/injector.util";

export enum EditStates {
    EDIT = 'Edit',
    SAVE = 'Save'
}

export enum StartStates {
    PLAY = 'Play',
    STOP = 'Stop'
}

export class ControlsService implements Injectable{
    private readonly DEFAULT_STEP_DELAY = 1000;

    private readonly _speedControl: HTMLInputElement;
    private readonly _editButton: HTMLButtonElement;
    private readonly _startButton: HTMLButtonElement;

    private _stepDelay: number = this.DEFAULT_STEP_DELAY;

    constructor() {
        this._editButton = document.getElementById('edit-button') as HTMLButtonElement;
        this._startButton = document.getElementById('start-button') as HTMLButtonElement;

        this._speedControl = document.getElementById('speed-input') as HTMLInputElement;

        this._speedControl.valueAsNumber = this.DEFAULT_STEP_DELAY;
        this._speedControl.addEventListener('blur', () => {

            if (this._speedControl.valueAsNumber > this.DEFAULT_STEP_DELAY) {
                this._speedControl.valueAsNumber = this.DEFAULT_STEP_DELAY;
            }
            if (this._speedControl.valueAsNumber < 0) {
                this._speedControl.valueAsNumber = 0;
            }

            this._stepDelay = this._speedControl.valueAsNumber;
            console.log(this._stepDelay);
        });
    }

    public subscribeEditClick(callback: Function): void {
        if (this._editButton) {
            this._editButton.addEventListener('click', () => {
                callback();
            });
        }
    }

    public subscribeStartClick(callback: Function): void {
        if (this._startButton) {
            this._startButton.addEventListener('click', () => {
                callback();
            });
        }
    }

    public activateEditButton(): void {
        this._editButton.disabled = false;
    }

    public deactivateEditButton(): void {
        this._editButton.disabled = true;
    }

    public activateStartButton(): void {
        this._startButton.disabled = false;
    }

    public deactivateStartButton(): void {
        this._startButton.disabled = true;
    }

    public switchEditState(state: EditStates): void {
        this._editButton.innerText = state;
    }

    public switchStartState(state: StartStates): void {
        this._startButton.innerText = state;
    }

    public get stepDelay(): number {
        return this._stepDelay;
    }
}
