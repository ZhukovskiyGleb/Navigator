import {ControlsService} from "./services/controls.service";
import {MapEditService} from "./services/map-edit.service";
import {LoggerService} from "./services/logger.service";
import {GameService} from "./services/game.service";
import {MapView} from "./views/map.view";
import {Injector} from "./utils/injector.util";

class Main {
    constructor() {
        Injector.inject(ControlsService);
        Injector.inject(MapView);
        Injector.inject(MapEditService);
        Injector.inject(LoggerService);
        Injector.inject(GameService);
    }

    public init(): void {

    }

}



const app = new Main();
app.init();

