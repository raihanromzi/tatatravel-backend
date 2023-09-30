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

const web = express()
web.use(express.json())
web.use(express.urlencoded({ extended: true }))
web.use(express.static('public'))
web.use(cookieParser())

web.use(tokenRouter)
web.use(publicRouter)
web.use(userRouter)
web.use(adminRouter)
web.use(areaRouter)
web.use(countryRouter)
web.use(roleRouter)
web.use(categoryRouter)

web.use(errorMiddleware)

export { web }
