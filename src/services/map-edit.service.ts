import {ControlsService, EditStates} from "./controls.service";
import {MapModel, PlayerPosition} from "../models/map.model";
import {Injectable, Injector} from "../utils/injector.util";
import {PathFinder} from "../utils/path-finder.util";
import {MapView} from "../views/map.view";
import {Cell} from "../utils/utils";

export class MapEditService implements Injectable {
    private readonly DEFAULT_MAP =  '##### #\n' +
                                    '# # # #\n' +
                                    '#   # #\n' +
                                    '# # # #\n' +
                                    '#v#   #\n' +
                                    '#######';

    private readonly _gameTab: HTMLDivElement;
    private readonly _editTab: HTMLDivElement;
    private readonly _speedControl: HTMLDivElement;
    private readonly _editArea: HTMLTextAreaElement;

    private _controlsService: ControlsService = Injector.get(ControlsService) as ControlsService;
    private _mapView: MapView = Injector.get(MapView) as MapView;

    private readonly _map: MapModel = new MapModel();
    private _path?: Array<Cell>;

    private _inEditMode?:Boolean;

    constructor() {
        this._gameTab = document.getElementById('game-tab') as HTMLDivElement;
        this._editTab = document.getElementById('edit-tab') as HTMLDivElement;
        this._speedControl = document.getElementById('speed-control') as HTMLDivElement;
        this._editArea = document.getElementById('edit-area') as HTMLTextAreaElement;

        this._editArea.addEventListener('paste', this.updateEditAreaSize.bind(this));
        this._editArea.addEventListener('keyup', this.updateEditAreaSize.bind(this));
        window.addEventListener('resize', this.updateEditAreaSize.bind(this));

        this.loadDefaultMap();

        this._controlsService.subscribeEditClick(this.onEditClick.bind(this));
    }

    private updateEditAreaSize(): void {
        if (!this._editArea.value || this._editArea.value.length === 0) {
            return;
        }

        const sizes = this._editArea.value.split('\n');
        const h = sizes.length;
        const w = sizes.reduce(
            (max: number, row: string) => {
                return Math.max(max, row.length);
            }, 0
        );

        const size = Math.min(
            Math.floor(this._editArea.offsetWidth / w),
            Math.floor(this._editArea.offsetHeight / h),
        );

        this._editArea.style.fontSize = size + 'px';
    }

    private loadDefaultMap(): void {
        this._editArea.textContent = this.DEFAULT_MAP;

        this.toggleEditMode(false);
    }

    private onEditClick(): void {
        this.toggleEditMode(!this._inEditMode);
    }

    private toggleEditMode(value: boolean): void {
        if (this._inEditMode === value) {
            return;
        }

        this._inEditMode = value;

        if (this._inEditMode) {
            this._controlsService.deactivateStartButton();
            this._controlsService.switchEditState(EditStates.SAVE);
            this._gameTab.style.display = 'none';
            this._speedControl.style.display = 'none';
            this._editTab.style.display = 'block';

            this.updateEditAreaSize();
        } else {
            if (this._map.init(this._editArea.value) && this.findPath()) {
                this._controlsService.activateStartButton();
                this._controlsService.switchEditState(EditStates.EDIT);
                this._gameTab.style.display = 'block';
                this._speedControl.style.display = 'block';
                this._editTab.style.display = 'none';

                this._mapView.buildMap(this._map.content, this._map.player);
            } else {
                alert('Wrong configuration!');
            }
        }
    }

    private findPath(): boolean {
        this._path = PathFinder.find(
            this._map.content,
            {
                row: this._map.player.row,
                col: this._map.player.col
            },
            this._map.exit ? {
                row: this._map.exit.row,
                col: this._map.exit.col
            } : undefined);

        if (this._path.length === 0) {
            console.log('Error: Path not found!');
            return false;
        }

        return true;
    }

    public get map(): MapModel {
        return this._map;
    }

    public get pathClone(): Array<Cell> {
        return this._path ? [...this._path] : [];
    }

    public get playerClone(): PlayerPosition {
        return {
            row: this._map.player.row,
            col: this._map.player.col,
            direction: this._map.player.direction
        };
    }
}
