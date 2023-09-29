import express from 'express'
import userController from '../controllers/user-controller.js'

const publicRouter = express.Router()

publicRouter.post('/v1/users/login', userController.login)

export { publicRouter }
