import {Injectable} from "../utils/injector.util";

export class LoggerService implements Injectable{
    private readonly _logArea: HTMLTextAreaElement;

    constructor() {
        this._logArea = document.getElementById('log-area') as HTMLTextAreaElement;
    }

    public clear(): void {
        this._logArea.textContent = '';
    }

    public log(message: string): void {
        this._logArea.textContent = message + '\n' + this._logArea.value;
    }
}
