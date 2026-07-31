import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';
import cors from 'cors'
import config from './config';
import { authRouter } from './module/auth/auth.route';
import { userRoutes } from './module/user/user.route';
import { gearRouter } from './module/gearItems/gear.route';
import { categoryRouter } from './module/category/catagory.route';

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
//user api
app.use("/api/users", userRoutes)
//provider api
app.use('/api/gear', gearRouter)
//category api
app.use('/api/categories', categoryRouter)



app.get('/', (req: Request, res: Response) => {
     res.send(' Welcome! GearUp - Sports & Outdoor Gear Rental Shop. ');
});

export default app