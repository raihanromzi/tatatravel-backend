import express from 'express'
import userController from '../controllers/user-controller.js'
import {
    accessTokenVerifyMiddleware,
    refreshTokenVerifyMiddleware,
} from '../middlewares/token-middleware.js'
import multer from 'multer'
import { fileFilterMiddleware, fileStorageAvatar } from '../middlewares/multer-middleware.js'

const userRouter = express.Router()

userRouter.use(accessTokenVerifyMiddleware)
userRouter.use(refreshTokenVerifyMiddleware)
userRouter.use(
    multer({
        limits: {
            fileSize: 1024 * 1024 * 2, // 2MB
        },
        storage: fileStorageAvatar,
        fileFilter: fileFilterMiddleware,
    }).single('avatar')
)

userRouter.get('/v1/users/current', userController.get)
userRouter.patch('/v1/users/current', userController.update)
userRouter.delete('/v1/users/current', userController.logout)

export { userRouter }
