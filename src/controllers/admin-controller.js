import adminService from '../service/admin-service.js'
import responses from '../utils/response-api.js'

const deleteUser = async (req, res, next) => {
    try {
        const user = req.user
        const userId = req.params.userId
        const result = await adminService.deleteUser(user, userId)

        res.status(200).send(responses.responseSuccess(200, 'OK', result))
    } catch (e) {
        next(e)
    }
}

const searchUser = async (req, res, next) => {
    try {
        const user = req.user
        const request = {
            name: req.query.name,
            email: req.query.email,
            username: req.query.username,
            role: req.query.role,
            page: req.query.page,
            size: req.query.size,
        }

        const result = await adminService.searchUser(user, request)
        res.status(200).send(
            responses.responseSuccess(200, 'OK', {
                data: result.data,
                pagination: result.pagination,
            })
        )
    } catch (e) {
        next(e)
    }
}

export default { searchUser, deleteUser }
