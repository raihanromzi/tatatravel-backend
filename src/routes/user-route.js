import express from 'express'
import { authMiddleware } from '../middlewares/auth-middleware.js'
import userController from '../controllers/user-controller.js'

const userRouter = express.Router()

userRouter.use(authMiddleware)
userRouter.get('/api/v1/users/current', userController.getUser)
userRouter.patch('/api/v1/users/current', userController.updateUser)
userRouter.delete('/api/v1/users/current', userController.logout)

export { userRouter }
