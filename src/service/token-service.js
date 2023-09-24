import jwt from 'jsonwebtoken'
import { ResponseError } from '../utils/response-error.js'
import { errors } from '../utils/message-error.js'
import { prismaClient } from '../application/database.js'

const refresh = async (req, res) => {
    const cookie = req.cookie
    const foundRefreshToken = cookie.refreshToken

    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
    })

    if (!foundRefreshToken) {
        throw new ResponseError(
            errors.HTTP_CODE_UNAUTHORIZED,
            errors.HTTP_STATUS_UNAUTHORIZED,
            errors.ERROR_AUTHORIZATION
        )
    }

    const foundUserWithRefreshToken = await prismaClient.user.findUnique({
        where: {
            token: foundRefreshToken,
        },
        select: {
            username: true,
        },
    })

    // detected refresh token reuse
    if (!foundUserWithRefreshToken) {
        // handle hacked user
        jwt.verify(foundRefreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, async (err, user) => {
            if (err) {
                throw new ResponseError(
                    errors.HTTP_CODE_FORBIDDEN,
                    errors.HTTP_STATUS_FORBIDDEN,
                    errors.ERROR_FORBIDDEN
                )
            }
            // if user not found, but refreshToken is reused and valid -> user hacked
            await prismaClient.user.update({
                where: {
                    username: user.username,
                },
                data: {
                    token: null,
                },
            })
        })
    }

    jwt.verify(foundRefreshToken, process.env.REFRESH_TOKEN_SECRET_KEY, async (err, user) => {
        if (err || foundUserWithRefreshToken.username !== user.username) {
            throw new ResponseError(
                errors.HTTP_CODE_FORBIDDEN,
                errors.HTTP_STATUS_FORBIDDEN,
                errors.ERROR_FORBIDDEN
            )
        }

        const newAccessToken = generateAccessToken(user)
        const newRefreshToken = generateRefreshToken(user)

        await prismaClient.user.update({
            where: {
                username: user.username,
            },
            data: {
                token: newRefreshToken,
            },
        })

        // creates Secure Cookie with refresh token
        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000,
        })

        return {
            newAccessToken,
            newRefreshToken,
        }
    })
}

const generateAccessToken = (validUser) => {
    return jwt.sign(validUser, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1m' })
}

const generateRefreshToken = (validUser) => {
    return jwt.sign(validUser, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '1d' })
}

export default { refresh }
