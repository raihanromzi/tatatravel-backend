import express from 'express'
import publicController from '../controllers/public-controller.js'

const publicRouter = express.Router()

// for testing only
// publicRouter.post('/v1/users', userController.add)

publicRouter.post('/v1/users/login', publicController.login)

export { publicRouter }
