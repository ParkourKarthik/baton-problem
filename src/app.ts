import * as bodyParser from 'body-parser';
import express from "express";
import { Routes } from './routes/indexRoutes';
import cors from 'cors';
import { errorHandler } from './helpers/error-handler';

class App {
    public app: express.Application;
    public routePrv: Routes = new Routes();

    constructor() {
        this.app = express();
        this.config();
        this.routePrv.routes(this.app);
    }

    private config(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cors());
        this.app.use(errorHandler);
    }
}

export default new App().app;