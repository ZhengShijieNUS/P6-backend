import express from 'express';
import { signup, login, removeUser } from '../controllers/userCtrl.js'

const userRouter = express.Router();

userRouter.post('/signup',signup)
userRouter.post('/login',login)
userRouter.delete('/remove', removeUser)


export default userRouter
