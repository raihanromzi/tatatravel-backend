import { errors } from '../utils/message-error.js'
import { logger } from '../application/logging.js'
import { JoiError } from '../utils/response-error.js'

const validate = (schema, request) => {
    const result = schema.validate(request, {
        abortEarly: false,
        allowUnknown: false,
    })
    if (result.error) {
        logger.info(result.error.details)
        const arrayOfErrors = result.error.details.map((item) => ({
            key: item.context.key,
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
