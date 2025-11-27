import express from 'express';
import { signup } from '../controllers/Auth.controller.js';


const authRouter = express.Router();

authRouter.post('/signup',signup)

export default authRouter;