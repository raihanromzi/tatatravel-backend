import { errors } from '../utils/message-error.js'
import { JoiError } from '../utils/response-error.js'
import { logger } from '../application/logging.js'

const validate = (schema, request) => {
    const result = schema.validate(request, {
        abortEarly: false,
        allowUnknown: false,
    })
    logger.info(result.error)
    if (result.error) {
        const arrayOfErrors = result.error.details.map((item) => ({
            key: item.context.key || item.context.label,
            message: item.message,
        }))
        throw new JoiError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            arrayOfErrors
        )
    } else {
        return result.value
    }
}

export { validate }
