import express from 'express';
import { createUser, loginUser } from '../controllers/authControllers.js';
import validateBody from '../helpers/validateBody.js';
import { createUserSchema, loginUserSchema } from '../schemas/authSchemas.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(createUserSchema), createUser);
authRouter.post('/login', validateBody(loginUserSchema), loginUser);

export default authRouter;
