export enum EditStates {
    EDIT = 'Edit',
    SAVE = 'Save'
}

export enum StartStates {
    PLAY = 'Play',
    STOP = 'Stop',
    PAUSE = 'Pause'
}

export class ControlsService {
    private readonly _editButton: HTMLButtonElement;
    private readonly _startButton: HTMLButtonElement;

    constructor() {
        this._editButton = document.getElementById('edit-button') as HTMLButtonElement;
        this._startButton = document.getElementById('start-button') as HTMLButtonElement;
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
}
