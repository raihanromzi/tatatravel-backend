import response from '../utils/response-api.js'

const adminMiddlewares = async (req, res, next) => {
    const user = req.user

    if (!user.role()) {
        res.status(401)
            .send(response.responseError(401, 'Unauthorized', 'role is unknown'))
            .end()
    }

    if (user.role().name !== 'admin') {
        res.status(401)
            .send(response.responseError(401, 'Unauthorized', 'role is not admin'))
            .end()
    }

    next()
}

export { adminMiddlewares }
