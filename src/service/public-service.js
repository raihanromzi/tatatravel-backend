import { validate } from '../validation/validation.js'
import { loginValidationSchema } from '../validation/user-validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import { errors } from '../utils/message-error.js'
import * as bcrypt from 'bcrypt'
import tokenService from './token-service.js'

const login = async (req, res) => {
    const { email, userName, password } = validate(loginValidationSchema, req.body)

    const findUser = await prismaClient.user.findUnique({
        where: {
            ...(email && { email: email }),
            ...(userName && { userName: userName }),
        },
        select: {
            id: true,
            userName: true,
            password: true,
            roleId: true,
        },
    })

    if (!findUser) {
        throw new ResponseError(
            errors.HTTP.CODE.UNAUTHORIZED,
            errors.HTTP.STATUS.UNAUTHORIZED,
            errors.AUTHENTICATION
        )
    }

    const { id, userName: foundUserName, password: passwordHash, roleId } = findUser
    const isPasswordValid = await bcrypt.compare(password, passwordHash)

    if (!isPasswordValid) {
        throw new ResponseError(
            errors.HTTP.CODE.UNAUTHORIZED,
            errors.HTTP.STATUS.UNAUTHORIZED,
            errors.AUTHENTICATION
        )
    }

    const userAccessTokenData = {
        id: id,
        roleId: roleId,
    }

    const userRefreshTokenData = {
        id: id,
        userName: foundUserName,
        roleId: roleId,
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
            id: id,
            userName: foundUserName,
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
