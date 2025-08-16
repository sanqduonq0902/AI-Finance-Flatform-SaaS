import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import { Env } from './config/env.config';
import cors from 'cors';
import { HTTP_STATUS } from './config/http.config';
import { errorHandler } from './middlewares/error-handler.middleware';
import connectMongoDB from './config/database.config';
import authRoutes from './routes/auth.router';
import userRoutes from './routes/user.router';
import transactionRoutes from './routes/transaction.router';
import passport from 'passport';
import './interface/user.interface';
import './config/passport.config';
import { passportAuthJwt } from './config/passport.config';

const app = express();
const BASE_PATH = Env.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(passport.initialize());

app.use(
    cors({
        origin: Env.FRONTEND_ORIGIN,
        credentials: true
    })
);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(HTTP_STATUS.OK).json({
        message: 'Server is running'
    });
});

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, passportAuthJwt, userRoutes);
app.use(`${BASE_PATH}/transaction`, passportAuthJwt, transactionRoutes);

app.use(errorHandler);

app.listen(Env.PORT, async () => {
    await connectMongoDB(),
    console.log(`App started at http://localhost:${Env.PORT}`);
});

