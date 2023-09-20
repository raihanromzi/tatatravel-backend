import { prismaClient } from '../../src/application/database.js'

describe('Prisma Client', () => {
    it('should be able to connect database', async () => {
        await prismaClient.$connect()
        await prismaClient.$disconnect()
    })
})
