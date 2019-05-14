import {Logger} from "./logger";

class Main {
    constructor() {
        const logger = new Logger();
        logger.log('start');

        const app = document.getElementById('app');
        if (app) {
            app.innerText = 'Test';
        }
    }
}

const app = new Main();

