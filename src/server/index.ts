import * as mongoose from 'mongoose';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as passport from 'passport';
import * as cors from 'cors';
import Routes from '../routes/Routes';


class Server {

    public server: express.Application;
    public router: Routes = new Routes(); 

    constructor() {
        this.server = express();
        this.config();
        this.mongoLaunch();
        this.router.routes(this.server);
    }

    private config(): void {
        this.server.use(bodyParser.json());
        this.server.use(cors());
        this.server.use(passport.initialize());
        dotenv.config({ path: '.env'});
    }

    private mongoLaunch(): void {
        const URL = process.env.MONGODB_URL;
        mongoose.set('debug', true);
        mongoose.connect(URL, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }) 
        .then(() => {
            console.log(`connected to ${URL}`);
        })
        .catch(err => console.log(err.message));  
    }

}

export default new Server().server;