import { Router } from 'express';

import { celebrate, Joi, Segments } from 'celebrate';

import SessionsController from '@modules/users/infra/http/controllers/SessionsController';

const sessionsRoute = Router();
const sessionController = new SessionsController();

sessionsRoute.post(
    '/',
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }
    }),
    sessionController.create,
);

export default sessionsRoute;
