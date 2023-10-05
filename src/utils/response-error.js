import fs from 'fs/promises'

class ResponseError extends Error {
    constructor(code, status, error) {
        super(error)
        this.status = status
        this.code = code
    }
}

class MulterError extends Error {
    constructor(code, status, error, images) {
        super(error)
        this.status = status
        this.code = code
        this.images = images
    }

    async deleteImages() {
        for (const image of this.images) {
            await fs.unlink(image.path)
        }
    }
}

export { ResponseError, MulterError }
