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
    MESSAGE: {
        INTERNAL_SERVER_ERROR: 'please try again later, server error',
        INVALID_API_ROUTE: 'please try again later, invalid api route',
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
    NOT_ACTIVE: 'category is not active',
    FAILED_TO_ADD: 'failed to add category',
    FAILED_TO_UPDATE: 'failed to update category',
    FAILED_TO_DELETE: 'failed to delete category',
}

const userErrors = {
    IS_ACTIVE: {
        IS_REQUIRED: 'is active is required',
        MUST_BOOLEAN: 'is active must be a boolean',
        CANNOT_EMPTY: 'is active cannot be empty',
    },
    ALREADY_EXISTS: 'user already exists',
    NOT_FOUND: 'user is not found',
    FAILED_TO_ADD: 'failed to add user',
    FAILED_TO_UPDATE: 'failed to update user',
    CANNOT_DELETE_YOURSELF: 'cannot delete yourself',
    FAILED_TO_DELETE_DIRECTORY: 'failed to delete user avatar directory',
    CANNOT_UPDATE_YOURSELF: 'cannot update yourself',
    FAILED_TO_DELETE_IMAGE: 'failed to delete user avatar',
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
    CANNOT_EMPTY: 'avatar cannot be empty',
}

const sortByErrors = {
    MUST_STRING: 'sort by must be a string',
    MUST_VALID: 'column sort by must be valid',
}

const orderByErrors = {
    MUST_STRING: 'order by must be a string',
    MUST_VALID: 'order by must be asc or desc',
}

const blogErrors = {
    TITLE: {
        IS_REQUIRED: 'title is required',
        MUST_STRING: 'title must be a string',
        MUST_MIN: 'title is min 3 characters',
        MUST_MAX: 'title is max 255 characters',
        CANNOT_EMPTY: 'title cannot be empty',
    },
    IMAGES: {
        PATH_MUST_STRING: 'images path must be a string',
        MUST_VALID: 'failed to add image, please upload image with PNG, JPG, or JPEG format',
        IS_REQUIRED: 'minimum 1 image is required',
        IMAGE_NOT_VALID: 'image is not valid, please upload image with PNG, JPG, or JPEG format',
        IMAGE_ARRAY: 'images must be an array',
    },
    SLUG: {
        IS_REQUIRED: 'slug is required',
        MUST_STRING: 'slug must be a string',
        MUST_MIN: 'slug is min 3 characters',
        MUST_MAX: 'slug is max 100 characters',
        CANNOT_EMPTY: 'slug cannot be empty',
        ALREADY_EXISTS: 'slug already exists',
    },
    DESCRIPTION: {
        IS_REQUIRED: 'description is required',
        MUST_STRING: 'description must be a string',
        MUST_MIN: 'description is min 3 characters',
        MUST_MAX: 'description is max 255 characters',
        CANNOT_EMPTY: 'description cannot be empty',
    },
    CONTENT: {
        IS_REQUIRED: 'content is required',
        MUST_STRING: 'content must be a string',
        MUST_MIN: 'content is min 3 characters',
        CANNOT_EMPTY: 'content cannot be empty',
    },
    ID: {
        IS_REQUIRED: 'blog id is required',
        MUST_NUMBER: 'blog id must be a number',
        MUST_POSITIVE: 'blog id must be a positive number',
        CANNOT_EMPTY: 'blog id cannot be empty',
    },
    FAILED_ADD: 'failed to add blog',
    FAILED_UPDATE: 'failed to update blog',
    FAILED_DELETE: 'failed to delete blog',
    NOT_FOUND: 'blog is not found',
    FAILED_TO_CREATE_DIRECTORY: 'failed to create blog images directory',
    FAILED_TO_FIND_DIRECTORY: 'failed to find blog images directory',
}

const tourErrors = {
    ID: {
        IS_REQUIRED: 'tour id is required',
        MUST_NUMBER: 'tour id must be a number',
        MUST_POSITIVE: 'tour id must be a positive number',
        CANNOT_EMPTY: 'tour id cannot be empty',
    },
    NAME: {
        IS_REQUIRED: 'tour name is required',
        MUST_STRING: 'tour name must be a string',
        MUST_MIN: 'tour name is min 3 characters',
        MUST_MAX: 'tour name is max 255 characters',
        CANNOT_EMPTY: 'tour name cannot be empty',
    },
    PRICE: {
        IS_REQUIRED: 'price is required',
        MUST_STRING: 'price must be a string',
        MUST_MIN: 'price is min 3 characters',
        MUST_MAX: 'price is max 255 characters',
        CANNOT_EMPTY: 'price cannot be empty',
    },
    DATE_START: {
        IS_REQUIRED: 'date start is required',
        MUST_NUMBER: 'date start must be a number',
        MUST_POSITIVE: 'date start must be a positive number',
        CANNOT_EMPTY: 'date start cannot be empty',
    },
    DATE_END: {
        IS_REQUIRED: 'date end is required',
        MUST_NUMBER: 'date end must be a number',
        MUST_POSITIVE: 'date end must be a positive number',
        CANNOT_EMPTY: 'date end cannot be empty',
    },
    DESCRIPTION: {
        IS_REQUIRED: 'description is required',
        MUST_STRING: 'description must be a string',
        MUST_MIN: 'description is min 3 characters',
        MUST_MAX: 'description is max 255 characters',
        CANNOT_EMPTY: 'description cannot be empty',
    },
    PLACE: {
        NAME: {
            IS_REQUIRED: 'place name is required',
            MUST_STRING: 'place name must be a string',
            MUST_MIN: 'place name is min 3 characters',
            MUST_MAX: 'place name is max 100 characters',
            CANNOT_EMPTY: 'place name cannot be empty',
        },
        IS_REQUIRED: 'place is required',
    },
    IMAGES: {
        PATH_MUST_STRING: 'images path must be a string',
        IMAGE_NOT_VALID: 'image is not valid, please upload image with PNG, JPG, or JPEG format',
        IMAGE_ARRAY: 'images must be an array',
        CANNOT_EMPTY: 'minimum 1 image is required',
        IS_REQUIRED: 'images is required',
    },
    NOT_FOUND: 'tour is not found',
    FAILED_TO_DELETE_DIRECTORY: 'failed to delete tour images directory',
    IS_NOT_ACTIVE: 'tour is not active',
}

const loginErrors = {
    MUST_VALID: 'username or email is required',
    MUST_STRING: 'username or email must be a string',
    CANNOT_EMPTY: 'username or email cannot be empty',
    MUST_MIN: 'username or email is min 3 characters',
    MUST_MAX: 'username or email is max 255 characters',
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
    SORT_BY: sortByErrors,
    ORDER_BY: orderByErrors,
    SIZE: sizeErrors,
    AREA: areaErrors,
    COUNTRY: countryErrors,
    BLOG: blogErrors,
    TOUR: tourErrors,
    IMAGES: {
        MUST_VALID: 'image must valid, please upload image with PNG, JPG, or JPEG format',
        ARRAY: 'images must be an array',
    },
    AUTHORIZATION: 'you are not authorized to access this resource',
    AUTHENTICATION: 'username or password is wrong',
    FORBIDDEN: 'you are not allowed to access this resource',
    SERVER_ERROR: 'server error, please try again',
    LOGIN: loginErrors,
}

export { errors }
