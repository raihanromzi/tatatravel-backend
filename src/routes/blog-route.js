import express from 'express'
import { authMiddleware } from '../middlewares/auth-middleware.js'
import blogController from '../controllers/blog-controller.js'

const blogRouter = express.Router()

blogRouter.use(authMiddleware)

blogRouter.post('/api/v1/blogs', blogController.add)
blogRouter.patch('/api/v1/blogs', blogController.update)
blogRouter.delete('/api/v1/blogs/:blogId', blogController.remove)
blogRouter.get('/api/v1/blogs/:blogId', blogController.get)
blogRouter.get('/api/v1/blogs', blogController.getAll)

export { blogRouter }
