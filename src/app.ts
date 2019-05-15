import {ControlsService} from "./services/controls.service";
import {MapEditService} from "./services/map-edit.service";
import {LoggerService} from "./services/logger.service";
import {GameService} from "./services/game.service";

class Main {
    private readonly _controlsService = new ControlsService();
    private readonly _mapEditService = new MapEditService(this._controlsService);
    private readonly _logerService = new LoggerService();
    private readonly _gameService = new GameService(this._controlsService, this._logerService, this._mapEditService);

    public init(): void {

    }

}



const app = new Main();
app.init();

