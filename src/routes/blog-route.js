import express from 'express'
import blogController from '../controllers/blog-controller.js'
import {
    accessTokenVerifyMiddleware,
    refreshTokenVerifyMiddleware,
} from '../middlewares/token-middleware.js'
import multer from 'multer'
import { fileFilterMiddleware, fileStorageBlogImages } from '../middlewares/multer-middleware.js'

const blogRouter = express.Router()

blogRouter.use(
    multer({
        limits: {
            fileSize: 1024 * 1024 * 5, // 5MB
        },
        storage: fileStorageBlogImages,
        fileFilter: fileFilterMiddleware,
    }).any('images')
)
blogRouter.use(accessTokenVerifyMiddleware)
blogRouter.use(refreshTokenVerifyMiddleware)

blogRouter.post('/v1/blogs', blogController.add)
blogRouter.patch('/v1/blogs/:id', blogController.update)
blogRouter.get('/v1/blogs/:id', blogController.getById)
blogRouter.get('/v1/blogs', blogController.get)
blogRouter.delete('/v1/blogs/:id', blogController.remove)

export { blogRouter }
