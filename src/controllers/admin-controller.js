import adminService from '../service/admin-service.js'
import responses from '../utils/response-api.js'
import { success } from '../utils/message-success.js'

const searchUser = async (req, res, next) => {
    try {
        const user = req.user
        const query = {
            name: req.query.name,
            email: req.query.email,
            username: req.query.username,
            role: req.query.role,
            page: req.query.page,
            size: req.query.size,
        }

        const result = await adminService.searchUser(user, query)
        res.status(success.HTTP_CODE_OK).send(
            responses.responseSuccess(
                success.HTTP_CODE_OK,
                success.HTTP_STATUS_OK,
                result.data,
                result.pagination
            )
        )
    } catch (e) {
        next(e)
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const user = req.user
        const userId = req.params.userId
        await adminService.deleteUser(user, userId)
        res.status(success.HTTP_CODE_OK).send(
            responses.responseSuccess(
                success.HTTP_CODE_OK,
                success.HTTP_STATUS_OK,
                success.SUCCESS_DELETE_USER
            )
        )
    } catch (e) {
        next(e)
    }
}

export default { searchUser, deleteUser }
