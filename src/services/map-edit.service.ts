import {ControlsService, EditStates} from "./controls.service";
import {MapModel} from "../models/map.model";

export class MapEditService {
    private readonly DEFAULT_MAP = '#######\n#   #>#\n#   # #\n# # # #\n# #   #\n# #####';

    private readonly _gameTab: HTMLDivElement;
    private readonly _editTab: HTMLDivElement;
    private readonly _editArea: HTMLTextAreaElement;

    private readonly _map: MapModel = new MapModel();

    private _inEditMode?:Boolean;

    constructor(private _controlsService: ControlsService) {
        this._gameTab = document.getElementById('game-tab') as HTMLDivElement;
        this._editTab = document.getElementById('edit-tab') as HTMLDivElement;
        this._editArea = document.getElementById('edit-area') as HTMLTextAreaElement;

        this.loadDefaultMap();

        this._controlsService.subscribeEditClick(this.onEditClick.bind(this));
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
            this._editTab.style.display = 'block';
        } else {
            if (this._map.init(this._editArea.value)) {
                this._controlsService.activateStartButton();
                this._controlsService.switchEditState(EditStates.EDIT);
                this._gameTab.style.display = 'block';
                this._editTab.style.display = 'none';
            } else {
                alert('Wrong configuration!');
            }
        }
    }

    public get map(): MapModel {
        return this._map;
    }
}
