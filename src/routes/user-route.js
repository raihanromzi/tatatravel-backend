import express from 'express'
import userController from '../controllers/user-controller.js'
import { accessTokenVerifyMiddleware } from '../middlewares/token-middleware.js'

const userRouter = express.Router()

userRouter.use(accessTokenVerifyMiddleware)

userRouter.post('/api/v1/users', userController.add)
userRouter.get('/api/v1/users/current', userController.get)
userRouter.patch('/api/v1/users/current', userController.update)
userRouter.delete('/api/v1/users/current', userController.logout)

export { userRouter }
