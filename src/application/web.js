import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
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
import {
    accessTokenVerifyMiddleware,
    // refreshTokenVerifyMiddleware,
} from '../middlewares/token-middleware.js'
import { adminMiddleware } from '../middlewares/admin-middleware.js'
import { errors } from '../utils/message-error.js'
import response from '../utils/response-api.js'
import { checkDbMiddleware } from '../middlewares/check-db-middleware.js'
import { multerMiddleware } from '../middlewares/multer-middleware.js'

const web = express()

web.use(express.json())
web.use(express.urlencoded({ extended: false }))
web.use(express.static('public', { etag: true }))
web.use(cookieParser())
web.use(checkDbMiddleware)
web.use(multerMiddleware)

web.use(
    cors({
        credentials: true,
        origin: 'http://localhost:8080',
    })
)

web.use(publicRouter)

// web.use(refreshTokenVerifyMiddleware)
web.use(tokenRouter)

web.use(accessTokenVerifyMiddleware)
web.use(userRouter)
web.use(tourRouter)
web.use(blogRouter)
web.use(areaRouter)
web.use(countryRouter)
web.use(roleRouter)
web.use(categoryRouter)

web.use(adminMiddleware)
web.use(adminRouter)

web.use(errorMiddleware)

// invalid api route
web.use((req, res) => {
    return res
        .status(errors.HTTP.CODE.UNAUTHORIZED)
        .send(
            response.responseError(
                errors.HTTP.CODE.UNAUTHORIZED,
                errors.HTTP.STATUS.UNAUTHORIZED,
                errors.AUTHORIZATION
            )
        )
        .end()
})

export { web }
