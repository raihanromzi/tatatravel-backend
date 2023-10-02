const httpErrors = {
    CODE: {
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        INTERNAL_SERVER_ERROR: 500,
    },
    STATUS: {
        BAD_REQUEST: 'bad request',
        UNAUTHORIZED: 'unauthorized',
        FORBIDDEN: 'forbidden',
        NOT_FOUND: 'not found',
        INTERNAL_SERVER_ERROR: 'internal server error',
    },
}

const categoryErrors = {
    NAME: {
        IS_REQUIRED: 'category name is required',
        MUST_STRING: 'category name must be a string',
        MUST_MIN: 'category name is min 3 characters',
        MUST_MAX: 'category name is max 100 characters',
        CANNOT_EMPTY: 'category name cannot be empty',
    },
    ID: {
        IS_REQUIRED: 'category id is required',
        MUST_NUMBER: 'category id must be a number',
        MUST_POSITIVE: 'category id must be a positive number',
        CANNOT_EMPTY: 'category id cannot be empty',
    },
    IS_ACTIVE: {
        IS_REQUIRED: 'is active is required',
        MUST_BOOLEAN: 'is active must be a boolean',
        CANNOT_EMPTY: 'is active cannot be empty',
    },
    ALREADY_EXISTS: 'category already exists',
    NOT_FOUND: 'category is not found',
    FAILED_TO_ADD: 'failed to add category',
    FAILED_TO_UPDATE: 'failed to update category',
    FAILED_TO_DELETE: 'failed to delete category',
}

const userErrors = {
    ALREADY_EXISTS: 'user already exists',
    NOT_FOUND: 'user is not found',
    FAILED_TO_ADD: 'failed to add user',
    FAILED_TO_UPDATE: 'failed to update user',
    CANNOT_DELETE_YOURSELF: 'cannot delete yourself',
    FAILED_TO_DELETE_DIRECTORY: 'failed to delete user avatar directory',
}

const roleErrors = {
    NAME: {
        IS_REQUIRED: 'role name is required',
        MUST_STRING: 'role name must be a string',
        MUST_MIN: 'role name is min 3 characters',
        MUST_MAX: 'role name is max 30 characters',
        CANNOT_EMPTY: 'role name cannot be empty',
    },
    ID: {
        IS_REQUIRED: 'role id is required',
        MUST_NUMBER: 'role id must be a number',
        MUST_POSITIVE: 'role id must be a positive number',
        CANNOT_EMPTY: 'role id cannot be empty',
    },
    IS_ACTIVE: {
        IS_REQUIRED: 'is active is required',
        MUST_BOOLEAN: 'is active must be a boolean',
        CANNOT_EMPTY: 'is active cannot be empty',
    },
    IS_UNKNOWN: 'role is unknown',
    IS_NOT_SUPER_ADMIN: 'role is not super admin',
    NOT_FOUND: 'role is not found',
    ALREADY_EXISTS: 'role already exists',
    FAILED_TO_ADD: 'failed to add role',
    FAILED_TO_UPDATE: 'failed to update role',
    FAILED_TO_DELETE: 'failed to delete role',
}

const fullNameErrors = {
    IS_REQUIRED: 'full name is required',
    MUST_STRING: 'full name must be a string',
    MUST_MIN: 'full name is min 3 characters',
    MUST_MAX: 'full name is max 255 characters',
    CANNOT_EMPTY: 'full name cannot be empty',
}

const usernameErrors = {
    IS_REQUIRED: 'username is required',
    MUST_STRING: 'username must be a string',
    MUST_MIN: 'username is min 3 characters',
    MUST_MAX: 'username is max 30 characters',
    CANNOT_EMPTY: 'username cannot be empty',
}

const emailErrors = {
    IS_REQUIRED: 'email is required',
    MUST_STRING: 'email must be a string',
    MUST_VALID: 'email must be a valid email',
    CANNOT_EMPTY: 'email cannot be empty',
}

const useridErrors = {
    IS_REQUIRED: 'user id is required',
    MUST_NUMBER: 'user id must be a number',
    MUST_POSITIVE: 'user id must be a positive number',
    CANNOT_EMPTY: 'user id cannot be empty',
}

const passwordErrors = {
    IS_REQUIRED: 'password is required',
    MUST_STRING: 'password must be a string',
    MUST_MIN: 'password is min 6 characters',
    MUST_MAX: 'password is max 255 characters',
    CANNOT_EMPTY: 'password cannot be empty',
    MUST_VALID: 'password must be a valid password',
}

const pageErrors = {
    MUST_NUMBER: 'page must be a number',
    CANNOT_EMPTY: 'page cannot be empty',
    MUST_POSITIVE: 'page must be a positive number',
}

const sizeErrors = {
    MUST_NUMBER: 'size must be a number',
    CANNOT_EMPTY: 'size cannot be empty',
    MUST_POSITIVE: 'size must be a positive number',
}

const areaErrors = {
    NAME: {
        IS_REQUIRED: 'area name is required',
        MUST_STRING: 'area name must be a string',
        MUST_MIN: 'area name is min 3 characters',
        MUST_MAX: 'area name is max 100 characters',
        CANNOT_EMPTY: 'area name cannot be empty',
    },
    ID: {
        IS_REQUIRED: 'area id is required',
        MUST_NUMBER: 'area id must be a number',
        MUST_POSITIVE: 'area id must be a positive number',
        CANNOT_EMPTY: 'area id cannot be empty',
    },
    NOT_FOUND: 'area is not found',
    ALREADY_EXISTS: 'area already exists',
    FAILED_TO_ADD: 'failed to add area',
    FAILED_TO_UPDATE: 'failed to update area',
    FAILED_TO_DELETE: 'failed to delete area',
}

const countryErrors = {
    ID: {
        IS_REQUIRED: 'country id is required',
        MUST_NUMBER: 'country id must be a number',
        MUST_POSITIVE: 'country id must be a positive number',
        CANNOT_EMPTY: 'country id cannot be empty',
    },
    NAME: {
        IS_REQUIRED: 'country name is required',
        MUST_STRING: 'country name must be a string',
        MUST_MIN: 'country name is min 3 characters',
        MUST_MAX: 'country name is max 100 characters',
        CANNOT_EMPTY: 'country name cannot be empty',
    },
    NOT_FOUND: 'country is not found',
    ALREADY_EXISTS: 'country already exists',
    FAILED_TO_ADD: 'failed to add country',
    FAILED_TO_UPDATE: 'failed to update country',
    FAILED_TO_DELETE: 'failed to delete country',
}

const avatarErrors = {
    MUST_VALID: 'file format must be PNG, JPG, or JPEG',
    MUST_STRING: 'avatar must be a string',
    PATH_MUST_STRING: 'avatar path must be a string',
    MUST_LESS_THAN_2MB: 'avatar must be less than 2MB',
}

const errors = {
    HTTP: httpErrors,
    CATEGORY: categoryErrors,
    USER: userErrors,
    ROLE: roleErrors,
    FULL_NAME: fullNameErrors,
    USERNAME: usernameErrors,
    AVATAR: avatarErrors,
    EMAIL: emailErrors,
    USERID: useridErrors,
    PASSWORD: passwordErrors,
    PAGE: pageErrors,
    SIZE: sizeErrors,
    AREA: areaErrors,
    COUNTRY: countryErrors,
    AUTHORIZATION: 'you are not authorized to access this resource',
    AUTHENTICATION: 'username or password is wrong',
    FORBIDDEN: 'you are not allowed to access this resource',
    SERVER_ERROR: 'server error, please try again',
}

export { errors }
