import express from 'express'
import userController from '../controllers/user-controller.js'

const publicRouter = express.Router()

publicRouter.post('/api/v1/users', userController.add)
publicRouter.post('/api/v1/users/login', userController.login)

export { publicRouter }
