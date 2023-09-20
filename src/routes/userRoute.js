import express from 'express'
import userController from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.post('/api/v1/users', userController.add)

export { userRouter }
