import express from 'express'
import publicController from '../controllers/public-controller.js'
import tourController from '../controllers/tour-controller.js'
import blogController from '../controllers/blog-controller.js'

const publicRouter = express.Router()

// For Testing Only
// publicRouter.post('/v1/users', adminController.add)

publicRouter.post('/v1/users/login', publicController.login)
publicRouter.get('/v1/tours', tourController.get)
publicRouter.get('/v1/blogs', blogController.get)

export { publicRouter }
