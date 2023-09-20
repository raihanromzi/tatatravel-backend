import { PrismaClient } from '@prisma/client'
import { log } from './logging.js'

export const prismaClient = new PrismaClient({
    errorFormat: 'pretty',
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'event',
            level: 'error',
        },
        {
            emit: 'event',
            level: 'info',
        },
        {
            emit: 'event',
            level: 'warn',
        },
    ],
})

prismaClient.$on('error', (e) => {
    log.error(e)
})

prismaClient.$on('warn', (e) => {
    log.warn(e)
})

prismaClient.$on('info', (e) => {
    log.info(e)
})

prismaClient.$on('query', (e) => {
    log.info(e)
})
