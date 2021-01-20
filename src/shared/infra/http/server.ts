import 'reflect-metadata';

import 'dotenv/config';

import express, {
    Request,
    Response,
    NextFunction,
    response
} from 'express';
import 'express-async-errors';

import cors from 'cors';

import routes from './routes';

import AppError from '@shared/errors/AppError';

import rateLimiter from '@shared/infra/http/middlewares/reateLimiter';

import '@shared/infra/typeorm';
import '@shared/container';

import uploadConfig from '@config/upload';
import { errors } from 'celebrate';

const app = express();

app.use(rateLimiter);
app.use(cors());

app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));

app.use(routes);

app.use(errors());

app.use((error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: 'error',
            message: error.message,
        });
    }

    console.log(error);

    return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
});

app.listen(3333, () => {
    console.log('Server started on port 3333!')
});
