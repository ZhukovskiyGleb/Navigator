import {Injectable} from "../utils/injector.util";

export class MapView implements Injectable{
    private readonly _mapArea: HTMLDivElement;

    constructor() {
        this._mapArea = document.getElementById('map-area') as HTMLDivElement;
    }

    public buildMap(map: Array<Array<boolean>>): void {

    }

    public clear(): void {
        this._mapArea.innerHTML = '';
    }
}
