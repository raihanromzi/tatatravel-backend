import { validate } from '../validation/validation.js'
import { addUserValidation } from '../validation/user-validation.js'
import { prismaClient } from '../application/database.js'
import { ResponseError } from '../utils/response-error.js'
import * as bcrypt from 'bcrypt'

const add = async (request) => {
    const user = validate(addUserValidation, request)

    const countUser = await prismaClient.user.count({
        where: {
            username: user.username,
            email: user.email,
        },
    })

    if (countUser === 1) {
        throw new ResponseError(400, 'Bad Request', 'Username or email already exists')
    }

    const hashedPassword = await bcrypt.hash(request.password, 10)

    const result = prismaClient.user.create({
        data: {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            password: hashedPassword,
            role: {
                connect: {
                    id: user.role,
                },
            },
        },
        select: {
            username: true,
            email: true,
        },
    })

    if (!result) {
        throw new ResponseError(500, 'Internal Server Error', 'Failed to add user')
    }

    return result
}

export default { add }
