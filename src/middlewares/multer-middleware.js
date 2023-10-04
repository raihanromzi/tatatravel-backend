import multer from 'multer'
import { errors } from '../utils/message-error.js'
import { ResponseError } from '../utils/response-error.js'
import * as fs from 'fs/promises'
import { nanoid } from 'nanoid'

const fileStorageAvatar = multer.diskStorage({
    destination: async (req, file, cb) => {
        const path = `public/images/avatar/${req.user.id}`
        await fs.mkdir(path, { recursive: true })

        const oldAvatar = await fs.readdir(`public/images/avatar/${req.user.id}`)
        for (const avatar of oldAvatar) {
            await fs.unlink(`public/images/avatar/${req.user.id}/${avatar}`)
        }

        cb(null, path)
    },
    filename: (req, file, cb) => {
        const id = nanoid(10)
        cb(null, id + '-' + req.user.id + '-' + file.originalname)
    },
})

const fileStorageBlogImages = multer.diskStorage({
    destination: async (req, file, cb) => {
        const path = `public/images/blog`
        await fs.mkdir(path, { recursive: true })

        cb(null, path)
    },
    filename: (req, file, cb) => {
        const id = nanoid(10)
        cb(null, id + '-' + file.originalname)
    },
})

const fileFilterMiddleware = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true)
    } else {
        cb(
            new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.AVATAR.MUST_VALID
            ),
            false
        )
    }
}

export { fileStorageAvatar, fileStorageBlogImages, fileFilterMiddleware }
