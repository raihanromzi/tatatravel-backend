import express from 'express'
import userController from '../controllers/user-controller.js'

const userRouter = express.Router()

userRouter.get('/v1/users/current', userController.get)
userRouter.patch('/v1/users/current', userController.update)
userRouter.delete('/v1/users/current', userController.logout)

export { userRouter }
