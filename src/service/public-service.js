import { validate } from '../validation/validation.js'
import { loginValidationSchema } from '../validation/user-validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import { errors } from '../utils/message-error.js'
import * as bcrypt from 'bcrypt'
import tokenService from './token-service.js'

const login = async (req, res) => {
    const validatedRequest = validate(loginValidationSchema, req)

    const foundUser = await prismaClient.user.findUnique({
        where: {
            email: validatedRequest.email,
        },
        select: {
            email: true,
            username: true,
            password: true,
            roleId: true,
        },
    })

    if (!foundUser) {
        throw new ResponseError(
            errors.HTTP_CODE_NOT_FOUND,
            errors.HTTP_STATUS_NOT_FOUND,
            errors.ERROR_USER_NOT_FOUND
        )
    }

    const isPasswordValid = await bcrypt.compare(validatedRequest.password, foundUser.password)

    if (!isPasswordValid) {
        throw new ResponseError(
            errors.HTTP_CODE_UNAUTHORIZED,
            errors.HTTP_STATUS_UNAUTHORIZED,
            errors.ERROR_WRONG_AUTHENTICATION
        )
    }

    const userAccessTokenData = {
        username: foundUser.username,
        roleId: foundUser.roleId,
    }

    const accessToken = tokenService.generateAccessToken(userAccessTokenData)
    const refreshToken = tokenService.generateRefreshToken(foundUser)

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    })

    await prismaClient.user.update({
        where: {
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
