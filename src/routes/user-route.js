import express from 'express'
import userController from '../controllers/user-controller.js'
import {
    accessTokenVerifyMiddleware,
    refreshTokenVerifyMiddleware,
} from '../middlewares/token-middleware.js'

const userRouter = express.Router()

userRouter.use(accessTokenVerifyMiddleware)
userRouter.use(refreshTokenVerifyMiddleware)

userRouter.get('/api/v1/users/current', userController.get)
userRouter.patch('/api/v1/users/current', userController.update)
userRouter.delete('/api/v1/users/current', userController.logout)

export { userRouter }
