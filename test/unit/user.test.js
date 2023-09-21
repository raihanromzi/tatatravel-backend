import supertest from 'supertest'
import { web } from '../../src/application/web.js'
import { logger } from '../../src/application/logging.js'
import { createRoleAdmin, createUserJohn, deleteUserJohn } from '../utils/test-util.js'

describe('POST /api/v1/users', () => {
    afterEach(async () => {
        await deleteUserJohn()
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

        expect(result.status).toBe(201)
        expect(result.body.data.username).toBe('johndoe')
        expect(result.body.data.email).toBe('johndoe@email.com')
        expect(result.body.data.password).toBeUndefined()
    })

    it('should not add new user', async () => {
        const result = await supertest(web).post('/api/v1/users').send({
            firstName: '',
            lastName: 'Doe',
            username: 'johndoe',
            email: 'johndoe@email.com',
            password: '123456',
            role: 1,
        })

        logger.info(result.body)

        expect(result.status).toBe(400)
        expect(result.body.errors).toBeDefined()
    })
})

describe('POST /api/v1/users/login', () => {
    beforeEach(async () => {
        await createUserJohn()
    })

    afterEach(async () => {
        await deleteUserJohn()
    })

    it('should can login', async () => {
        const result = await supertest(web).post('/api/v1/users/login').send({
            email: 'johndoe@email.com',
            password: '123456',
        })

        logger.info(result.body)

        expect(result.status).toBe(200)
        expect(result.body.data.token).toBeDefined()
        expect(result.body.data.token).not.toBe('test')
    })
})
