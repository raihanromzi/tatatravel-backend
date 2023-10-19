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

class MulterErrorMultipleImages extends Error {
    constructor(code, status, error, images) {
        super(error)
        this.status = status
        this.code = code
        this.images = images
    }

    async deleteImages() {
        for (const images of this.images) {
            for (const image of images) {
                await fs.unlink(image.path)
            }
        }
    }
}

class JoiError extends Error {
    constructor(code, status, errors) {
        super()
        this.status = status
        this.code = code
        this.errors = errors
    }

    // Override the toString method to provide a custom string representation
    toString() {
        return JSON.stringify({
            code: this.code,
            status: this.status,
            errors: this.errors,
        })
    }
}

export { ResponseError, MulterError, JoiError, MulterErrorMultipleImages }
