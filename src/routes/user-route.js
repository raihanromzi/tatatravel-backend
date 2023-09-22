import express from 'express'
import { authMiddleware } from '../middlewares/auth-middleware.js'
import userController from '../controllers/user-controller.js'
import { publicRouter } from './public-route.js'

const userRouter = express.Router()

userRouter.use(authMiddleware)
publicRouter.post('/api/v1/users', userController.add)
userRouter.get('/api/v1/users/current', userController.getUser)
userRouter.patch('/api/v1/users/current', userController.updateUser)
userRouter.delete('/api/v1/users/current', userController.logout)

export { userRouter }
