import {ControlsService} from "./services/controls.service";
import {MapEditService} from "./services/map-edit.service";

class Main {
    private readonly _controlsService = new ControlsService();
    private readonly _mapEditService = new MapEditService(this._controlsService);

    public init(): void {
        // PathFinder.find(
        //     this._mapEditService.map.content,
        //     {
        //         row: this._mapEditService.map.player.row,
        //         col: this._mapEditService.map.player.col
        //     },
        //     this._mapEditService.map.exit ? {
        //         row: this._mapEditService.map.exit.row,
        //         col: this._mapEditService.map.exit.col
        //     } : undefined)
    }

}



const app = new Main();
app.init();

