import express from 'express'
import blogController from '../controllers/blog-controller.js'
import {
    accessTokenVerifyMiddleware,
    refreshTokenVerifyMiddleware,
} from '../middlewares/token-middleware.js'
import multer from 'multer'
import { fileFilterMiddleware, fileStorageBlogImages } from '../middlewares/multer-middleware.js'

const blogRouter = express.Router()

blogRouter.use(accessTokenVerifyMiddleware)
blogRouter.use(refreshTokenVerifyMiddleware)
blogRouter.use(
    multer({
        limits: {
            fileSize: 1024 * 1024 * 5, // 5MB
        },
        storage: fileStorageBlogImages,
        fileFilter: fileFilterMiddleware,
    }).array('images', 5)
)

blogRouter.post('/v1/blogs', blogController.add)
blogRouter.get('/v1/blogs/:blogId', blogController.getById)
blogRouter.get('/v1/blogs', blogController.get)
blogRouter.patch('/v1/blogs', blogController.update)
blogRouter.delete('/v1/blogs/:blogId', blogController.remove)

export { blogRouter }
