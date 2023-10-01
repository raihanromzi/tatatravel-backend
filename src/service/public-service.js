import { validate } from '../validation/validation.js'
import { loginValidationSchema } from '../validation/user-validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import { errors } from '../utils/message-error.js'
import * as bcrypt from 'bcrypt'
import tokenService from './token-service.js'

const login = async (req, res) => {
    const userLoggedIn = validate(loginValidationSchema, req.body)

    const foundUser = await prismaClient.user.findUnique({
        where: {
            email: userLoggedIn.email,
        },
        select: {
            id: true,
            username: true,
            password: true,
            roleId: true,
        },
    })

    if (!foundUser) {
        throw new ResponseError(
            errors.HTTP.CODE.NOT_FOUND,
            errors.HTTP.STATUS.NOT_FOUND,
            errors.USER.NOT_FOUND
        )
    }

    const isPasswordValid = await bcrypt.compare(userLoggedIn.password, foundUser.password)

    if (!isPasswordValid) {
        throw new ResponseError(
            errors.HTTP.CODE.UNAUTHORIZED,
            errors.HTTP.STATUS.UNAUTHORIZED,
            errors.AUTHENTICATION
        )
    }

    const userAccessTokenData = {
        id: foundUser.id,
        roleId: foundUser.roleId,
    }

    const userRefreshTokenData = {
        id: foundUser.id,
        username: foundUser.username,
        roleId: foundUser.roleId,
    }

    const accessToken = tokenService.generateAccessToken(userAccessTokenData)
    const refreshToken = tokenService.generateRefreshToken(userRefreshTokenData)

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    })

    await prismaClient.user.update({
        where: {
            id: foundUser.id,
            username: foundUser.username,
        },
        data: {
            token: refreshToken,
        },
    })

    return {
        accessToken: accessToken,
    }
}

export default { login }
