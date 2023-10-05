const httpSuccess = {
    CODE: {
        OK: 200,
        CREATED: 201,
    },
    STATUS: {
        OK: 'OK',
        CREATED: 'created',
    },
}

const success = {
    HTTP: httpSuccess,
    AUTHENTICATION: {
        LOGOUT: 'logout success',
    },
    USER: {
        DELETE: 'success delete user',
    },
    AREA: {
        DELETE: 'success delete area',
    },
    COUNTRY: {
        DELETE: 'success delete country',
    },
    ROLE: {
        DELETE: 'success delete role',
    },
    CATEGORY: {
        DELETE: 'success delete category',
    },
    BLOG: {
        DELETE: 'success delete blog',
    },
}

export { success }
