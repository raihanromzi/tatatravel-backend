import supertest from 'supertest'
import { web } from '../../src/application/web.js'
import { prismaClient } from '../../src/application/database.js'
import { logger } from '../../src/application/logging.js'

describe('POST /api/v1/users', () => {
    afterEach(async () => {
        await prismaClient.user.deleteMany({
            where: {
                username: 'johndoe',
            },
        })
    })

    it('should can add new user', async () => {
        const result = await supertest(web).post('/api/v1/users').send({
            firstName: 'John',
            lastName: 'Doe',
            username: 'johndoe',
            email: 'johndoe@email.com',
            password: '123456',
            role: 1,
        })

        logger.info(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe('johndoe')
        expect(result.body.data.email).toBe('johndoe@email.com')
        expect(result.body.data.password).toBeUndefined()
    })
})
