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
        LOGOUT: 'You have successfully logged out.',
    },
    USER: {
        DELETE: 'The user has been successfully deleted.',
    },
    AREA: {
        DELETE: 'The area has been successfully deleted.',
    },
    COUNTRY: {
        DELETE: 'The country has been successfully deleted.',
    },
    ROLE: {
        DELETE: 'The role has been successfully deleted.',
    },
    CATEGORY: {
        DELETE: 'The category has been successfully deleted.',
    },
    BLOG: {
        DELETE: 'The blog has been successfully deleted.',
    },
    TOUR: {
        DELETE: 'The tour has been successfully deleted.',
    },
}

export { success }
