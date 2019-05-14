import {MapModel} from "./models/map.model";

class Main {
    private mapModel = new MapModel();

    public init(): void {
        const logArea: HTMLTextAreaElement = document.getElementById('log-area') as HTMLTextAreaElement;
        if (logArea) {

        }

        this.mapModel = new MapModel();
        this.mapModel.init('#####\n# > #\n#####');

        console.log(this.mapModel.height, this.mapModel.width);
    }
}

const app = new Main();
app.init();

