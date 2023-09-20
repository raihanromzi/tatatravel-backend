import { cleanObj } from './clean-obj.js'

const responseSuccess = (code, status, data) =>
    cleanObj({
        code,
        status,
        data,
    })

const responseError = (code, status, error) =>
    cleanObj({
        code,
        status,
        errors: error,
    })

export default { responseSuccess, responseError }
