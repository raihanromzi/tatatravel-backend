import express from 'express'
import blogController from '../controllers/blog-controller.js'

const blogRouter = express.Router()

blogRouter.post('/v1/blogs', blogController.add)
blogRouter.patch('/v1/blogs/:id', blogController.update)
blogRouter.get('/v1/blogs/:id', blogController.getById)
blogRouter.get('/v1/blogs', blogController.get)
blogRouter.delete('/v1/blogs/:id', blogController.remove)

export { blogRouter }
