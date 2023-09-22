import { prismaClient } from '../../src/application/database.js'
import bcrypt from 'bcrypt'

const deleteUserJohn = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: 'johndoe',
        },
    })
}

const deleteUserJohnNew = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: 'johndoenew',
        },
    })
}

const createUserJohn = async () => {
    await prismaClient.user.create({
        data: {
            firstName: 'John',
            lastName: 'Doe',
            username: 'johndoe',
            email: 'johndoe@email.com',
            password: await bcrypt.hash('123456', 10),
            token: 'test',
            role: {
                connect: {
                    id: 1,
                },
            },
        },
    })
}

const deleteRoleAdmin = async () => {
    await prismaClient.role.deleteMany({
        where: {
            name: 'ADMIN',
        },
    })
}

const createRoleAdmin = async () => {
    const roleCount = await prismaClient.role.count({
        where: {
            name: 'ADMIN',
        },
    })

    if (roleCount < 0) {
        await deleteRoleAdmin
    }

    await prismaClient.role.create({
        data: {
            name: 'ADMIN',
        },
    })
}

export { deleteUserJohn, deleteUserJohnNew, createUserJohn, deleteRoleAdmin, createRoleAdmin }
