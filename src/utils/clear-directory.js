import fs from 'fs/promises'
import { ResponseError } from './response-error.js'
import { errors } from './message-error.js'

async function clearDirectory(directory) {
    try {
        const files = await fs.readdir(directory)
        for (const file of files) {
            const filePath = `${directory}/${file}`
            await fs.unlink(filePath)
        }
    } catch (error) {
        throw new ResponseError(
            errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
            errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
            errors.BLOG.FAILED_TO_FIND_DIRECTORY
        )
    }
}

export { clearDirectory }
