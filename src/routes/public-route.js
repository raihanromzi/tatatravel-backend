import express from 'express'
import userController from '../controllers/user-controller.js'

const publicRouter = express.Router()

// for testing only
// publicRouter.post('/v1/users', userController.add)

publicRouter.post('/v1/users/login', userController.login)

export { publicRouter }
