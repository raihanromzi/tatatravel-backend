import express from 'express'
import tourController from '../controllers/tour-controller.js'
import {
    accessTokenVerifyMiddleware,
    refreshTokenVerifyMiddleware,
} from '../middlewares/token-middleware.js'
import multer from 'multer'
import { fileFilterMiddleware, fileStorageTourImages } from '../middlewares/multer-middleware.js'

const tourRouter = express.Router()

tourRouter.use(
    multer({
        limits: {
            fileSize: 1024 * 1024 * 5, // 5MB
        },
        storage: fileStorageTourImages,
        fileFilter: fileFilterMiddleware,
    }).any('images')
)
tourRouter.use(accessTokenVerifyMiddleware)
tourRouter.use(refreshTokenVerifyMiddleware)

tourRouter.post('/v1/tours', tourController.add)

export { tourRouter }
