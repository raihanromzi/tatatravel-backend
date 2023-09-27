import express from 'express'
import userController from '../controllers/user-controller.js'
import { publicRouter } from './public-route.js'
import { accessTokenVerifyMiddleware } from '../middlewares/token-middleware.js'

const userRouter = express.Router()

userRouter.use(accessTokenVerifyMiddleware)

publicRouter.post('/api/v1/users', userController.add)
userRouter.get('/api/v1/users/current', userController.getUser)
userRouter.patch('/api/v1/users/current', userController.updateUser)
userRouter.delete('/api/v1/users/current', userController.logout)

export { userRouter }
