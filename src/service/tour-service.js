import { validate } from '../validation/validation.js'
import { addTourValidationSchema } from '../validation/tour-validation.js'
import { imagesValidationSchema } from '../validation/blog-validation.js'
import { prismaClient } from '../application/database.js'

const add = async (req) => {
    const tour = validate(addTourValidationSchema, req.body)
    const images = validate(imagesValidationSchema, req.files)
    const tourImages = images.map((image) => {
        return {
            id: null,
            filename: image.filename,
            path: image.path,
        }
    })
    const { id: userId } = req.user
    const { name, price, dateStart, dateEnd, description, place } = tour

    return prismaClient.$transaction(async () => {})
}

export default { add }
