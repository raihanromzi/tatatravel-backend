import supertest from 'supertest'
import { web } from '../../src/application/web.js'
import { logger } from '../../src/application/logging.js'
import { createUserJohn, deleteUserJohn, deleteUserJohnNew } from '../utils/test-util.js'

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

describe('GET /api/v1/users/current', () => {
    beforeEach(async () => {
        await createUserJohn()
    })

    afterEach(async () => {
        await deleteUserJohn()
    })

    it('should get current user', async () => {
        const result = await supertest(web)
            .get('/api/v1/users/current')
            .set('Authorization', 'Bearer test')

        logger.info(result.headers)

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe('johndoe')
    })

    it('should not get current user', async () => {
        const result = await supertest(web)
            .get('/api/v1/users/current')
            .set('Authorization', 'Bearer wrong')

        logger.info(result.headers)

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined()
    })
})

describe('PATCH /api/v1/users/current', () => {
    beforeEach(async () => {
        await createUserJohn()
    })

    afterEach(async () => {
        await deleteUserJohnNew()
    })

    it('should can update current user', async () => {
        const result = await supertest(web)
            .patch('/api/v1/users/current')
            .set('Authorization', 'Bearer test')
            .send({
                newUsername: 'johndoenew',
                firstName: 'John',
                lastName: 'Doe',
            })

        expect(result.status).toBe(200)
        expect(result.body.data.username).toBe('johndoenew')
    })

    it('should not update current user', async () => {
        const result = await supertest(web)
            .patch('/api/v1/users/current')
            .set('Authorization', 'salah')
            .send({})

        expect(result.status).toBe(401)
    })
})
