import express from 'express'
import publicController from '../controllers/public-controller.js'
import adminController from '../controllers/admin-controller.js'

const publicRouter = express.Router()

// For Testing Only
publicRouter.post('/v1/users', adminController.add)

publicRouter.post('/v1/users/login', publicController.login)

export { publicRouter }
