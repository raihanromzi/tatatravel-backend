import express from 'express'
import cookieParser from 'cookie-parser'
import { errorMiddleware } from '../middlewares/error-middleware.js'
import { publicRouter } from '../routes/public-route.js'
import { userRouter } from '../routes/user-route.js'
import { tokenRouter } from '../routes/token-route.js'
import { adminRouter } from '../routes/admin-route.js'
import { areaRouter } from '../routes/area-route.js'
import { countryRouter } from '../routes/country-route.js'
import { roleRouter } from '../routes/role-route.js'
import { categoryRouter } from '../routes/category-route.js'
import { blogRouter } from '../routes/blog-route.js'
import { tourRouter } from '../routes/tour-route.js'
import multer from 'multer'
import { fileFilterMiddleware, fileStorageImages } from '../middlewares/multer-middleware.js'

const web = express()

web.use(express.json())
web.use(express.urlencoded({ extended: false }))
web.use(express.static('public', { etag: true }))
web.use(cookieParser())
web.use(
    multer({
        limits: {
            fileSize: 1024 * 1024 * 5, // 5MB
        },
        storage: fileStorageImages,
        fileFilter: fileFilterMiddleware,
    }).any('images')
)

web.use(publicRouter)
web.use(tourRouter)
web.use(blogRouter)
web.use(tokenRouter)
web.use(userRouter)
web.use(adminRouter)
web.use(areaRouter)
web.use(countryRouter)
web.use(roleRouter)
web.use(categoryRouter)

web.use(errorMiddleware)

export { web }
