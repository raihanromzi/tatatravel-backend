import express from 'express'
import publicController from '../controllers/public-controller.js'

const publicRouter = express.Router()

publicRouter.post('/v1/users/login', publicController.login)

export { publicRouter }
