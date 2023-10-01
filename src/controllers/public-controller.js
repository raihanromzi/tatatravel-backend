import publicService from '../service/public-service.js'
import { success } from '../utils/message-success.js'
import responses from '../utils/response-api.js'

const login = async (req, res, next) => {
    try {
        const result = await publicService.login(req, res)
        res.status(success.HTTP.CODE.OK).send(
            responses.responseSuccess(success.HTTP.CODE.OK, success.HTTP.STATUS.OK, result)
        )
    } catch (e) {
        next(e)
    }
}

export default { login }
