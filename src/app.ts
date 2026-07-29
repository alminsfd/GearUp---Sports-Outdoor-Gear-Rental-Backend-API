import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';
import cors from 'cors'
import config from './config';
import { authRouter } from './module/auth/auth.route';

const app: Application = express();
app.use(cors({
     origin: config.app_url,
     credentials: true,
}))
// parse application/json
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Auth api
app.use('/api/auth', authRouter)



app.get('/', (req: Request, res: Response) => {
     res.send(' Welcome! GearUp - Sports & Outdoor Gear Rental Shop. ');
});

export default app