import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';
import cors from 'cors'
import config from './config';
import { authRouter } from './module/auth/auth.route';
import { userRoutes } from './module/user/user.route';
import { gearRouter } from './module/gearItems/gear.route';
import { categoryRouter } from './module/category/catagory.route';
import { rentalRouter } from './module/rentalorder/rental.route';
import { reviewRouter } from './module/review/review.route';
import { adminRouter } from './module/admin/admin.router';

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
//rental order
app.use('/api/rentals', rentalRouter)
//reviews
app.use('/api/reviews', reviewRouter)
// admin api
app.use('/api/admin/', adminRouter)




app.get('/', (req: Request, res: Response) => {
     res.send(' Welcome! GearUp - Sports & Outdoor Gear Rental Shop. ');
});

export default app