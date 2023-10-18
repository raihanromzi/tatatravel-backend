import response from '../utils/response-api.js'
import { errors } from '../utils/message-error.js'
import jwt from 'jsonwebtoken'
import { prismaClient } from '../application/database.js'

const accessTokenVerifyMiddleware = async (req, res, next) => {
    const authHeader = req.get('Authorization')

    if (!authHeader?.startsWith('Bearer ')) {
        res.status(errors.HTTP.CODE.UNAUTHORIZED)
            .send(
                response.responseError(
                    errors.HTTP.CODE.UNAUTHORIZED,
                    errors.HTTP.STATUS.UNAUTHORIZED,
                    errors.AUTHORIZATION
                )
            )
            .end()
        return
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
        res.status(errors.HTTP.CODE.UNAUTHORIZED)
            .send(
                response.responseError(
                    errors.HTTP.CODE.UNAUTHORIZED,
                    errors.HTTP.STATUS.UNAUTHORIZED,
                    errors.AUTHORIZATION
                )
            )
            .end()
        return
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
        if (err) {
            res.status(errors.HTTP.CODE.FORBIDDEN)
                .send(
                    response.responseError(
                        errors.HTTP.CODE.FORBIDDEN,
                        errors.HTTP.STATUS.FORBIDDEN,
                        errors.HTTP.MESSAGE.FORBIDDEN
                    )
                )
                .end()
            return
        }
        // save user to req.user
        req.user = user
        next()
    })
}

const refreshTokenVerifyMiddleware = async (req, res, next) => {
    const foundRefreshToken = req.cookies.refreshToken

    if (!foundRefreshToken) {
        res.status(errors.HTTP.CODE.UNAUTHORIZED)
            .send(
                response.responseError(
                    errors.HTTP.CODE.UNAUTHORIZED,
                    errors.HTTP.STATUS.UNAUTHORIZED,
                    errors.AUTHORIZATION
                )
            )
            .end()
        return
    }

    // check refresh token in db
    const foundRefreshTokenInDB = await prismaClient.user.count({
        where: {
            token: foundRefreshToken,
        },
    })

    if (foundRefreshTokenInDB !== 1) {
        res.status(errors.HTTP.CODE.UNAUTHORIZED)
            .send(
                response.responseError(
                    errors.HTTP.CODE.UNAUTHORIZED,
                    errors.HTTP.STATUS.UNAUTHORIZED,
                    errors.AUTHORIZATION
                )
            )
            .end()
        return
    }

    jwt.verify(foundRefreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, (err, user) => {
        if (err) {
            res.status(errors.HTTP.CODE.FORBIDDEN)
                .send(
                    response.responseError(
                        errors.HTTP.CODE.FORBIDDEN,
                        errors.HTTP.STATUS.FORBIDDEN,
                        errors.HTTP.MESSAGE.FORBIDDEN
                    )
                )
                .end()
            return
        }
        // save user to req.user
        req.user = user
        next()
    })
}

export { accessTokenVerifyMiddleware, refreshTokenVerifyMiddleware }
