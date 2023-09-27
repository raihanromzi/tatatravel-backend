import { ResponseError } from '../utils/response-error.js'
import { errors } from '../utils/message-error.js'

const validate = (schema, request) => {
    const result = schema.validate(request, {
        abortEarly: false,
        allowUnknown: false,
    })
    if (result.error) {
        throw new ResponseError(
            errors.HTTP_CODE_BAD_REQUEST,
            errors.HTTP_STATUS_BAD_REQUEST,
            result.error.message
        )
    } else {
        return result.value
    }
}

export { validate }
