import express from 'express';
import {
  createUser,
  loginUser,
  logoutUser,
  getUserDataById,
} from '../controllers/authControllers.js';
import validateBody from '../helpers/validateBody.js';
import { auth } from '../auth/auth.js';
import { createUserSchema, loginUserSchema } from '../schemas/authSchemas.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(createUserSchema), createUser);
authRouter.post('/login', validateBody(loginUserSchema), loginUser);
authRouter.post('/logout', auth, logoutUser);
authRouter.get('/current', auth, getUserDataById);

export default authRouter;
