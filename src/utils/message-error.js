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
        INTERNAL_SERVER_ERROR:
            "We're sorry, but there was a server error. Please try again later. If the issue persists, please contact support.",
        INVALID_API_ROUTE:
            'The requested API route is not valid. Please check your request and try again later.',
        FORBIDDEN: 'you are not allowed to access this resource',
        NOT_FOUND: 'the requested resource is not found',
        UNKNOWN_BODY_ERROR: 'The request body is invalid. Please check your input and try again.',
    },
}

const categoryErrors = {
    NAME: {
        IS_REQUIRED: 'Please provide a category name.',
        MUST_BE_STRING: 'Category name must be a string of 3 to 100 characters.',
        CANNOT_BE_EMPTY: 'Category name cannot be left empty.',
        MUST_BE_3_CHAR_MIN: 'Category name should be at least 3 characters long.',
        MUST_BE_50_CHAR_MAX: 'Category name cannot exceed 50 characters.',
    },
    ID: {
        IS_REQUIRED: 'Please provide the category ID.',
        MUST_BE_NUMBER: 'Category ID must be a valid number.',
        MUST_BE_POSITIVE: 'Category ID must be a positive number.',
        CANNOT_BE_EMPTY: 'Category ID cannot be left empty.',
        MUST_VALID: 'Category ID must be a valid.',
    },
    IS_ACTIVE: {
        IS_REQUIRED: 'Please specify if the category is active.',
        MUST_BE_BOOLEAN: 'The is active value must be a valid boolean.',
        CANNOT_BE_EMPTY: 'The is active field cannot be left empty.',
    },
    ALREADY_EXISTS: 'This category already exists.',
    NOT_FOUND: 'The specified category was not found.',
    NOT_ACTIVE: 'This category is currently not active.',
    FAILED_TO_ADD:
        'Sorry, we encountered an issue while adding the category. Please try again later.',
    FAILED_TO_UPDATE:
        'Sorry, we encountered an issue while updating the category. Please try again later.',
    FAILED_TO_DELETE:
        'Sorry, we encountered an issue while deleting the category. Please try again later.',
}

const userErrors = {
    ID: {
        MUST_BE_VALID: 'User ID must be a valid.',
    },
    IS_ACTIVE: {
        IS_REQUIRED: 'Please specify if the user is active.',
        MUST_BE_BOOLEAN: 'The is active value must be either true or false.',
        CANNOT_BE_EMPTY: 'The is active field cannot be left empty.',
    },
    ALREADY_EXISTS: 'This user already exists.',
    USERNAME_ALREADY_EXIST: 'This username already exists.',
    EMAIL_ALREADY_EXIST: 'This email already exists.',
    NOT_FOUND: 'User not found.',
    FAILED_TO_ADD: 'Sorry, we encountered a problem while adding the user. Please try again later.',
    FAILED_TO_UPDATE:
        'Sorry, we encountered an issue while updating the user. Please try again later.',
    CANNOT_DELETE_YOURSELF: 'You cannot delete your own account.',
    FAILED_TO_DELETE_DIRECTORY: 'Failed to delete the user avatar directory.',
    CANNOT_UPDATE_YOURSELF: 'You cannot update your own account.',
    FAILED_TO_DELETE_IMAGE: 'Failed to delete the user avatar.',
    IS_NOT_ACTIVE: 'This user is currently not active.',
}

const roleErrors = {
    NAME: {
        IS_REQUIRED: 'Please provide a role name.',
        MUST_BE_STRING: 'Role name must be a valid string.',
        MUST_BE_3_CHAR_MIN: 'Role name should be at least 3 characters long.',
        MUST_BE_30_CHAR_MAX: 'Role name cannot exceed 30 characters.',
        CANNOT_BE_EMPTY: 'Role name cannot be left empty.',
    },
    ID: {
        IS_REQUIRED: 'Role is required.',
        MUST_BE_VALID: 'Role must be a valid.',
        MUST_BE_POSITIVE: 'Role must be a positive number.',
        CANNOT_BE_EMPTY: 'Role cannot be empty.',
    },
    IS_ACTIVE: {
        IS_REQUIRED: 'Please specify if the role is active.',
        MUST_BE_BOOLEAN: 'The is active value must be a valid boolean.',
        CANNOT_BE_EMPTY: 'The is active field cannot be left empty.',
    },
    IS_UNKNOWN: 'Role is unknown.',
    IS_NOT_ACTIVE: 'This role is currently not active.',
    IS_NOT_SUPER_ADMIN: 'This role is not a super admin role.',
    NOT_FOUND: 'Role not found.',
    ALREADY_EXISTS: 'This role already exists.',
    FAILED_TO_ADD: 'Sorry, we encountered an issue while adding the role. Please try again later.',
    FAILED_TO_UPDATE:
        'Sorry, we encountered an issue while updating the role. Please try again later.',
    FAILED_TO_DELETE:
        'Sorry, we encountered an issue while deleting the role. Please try again later.',
}

const fullNameErrors = {
    IS_REQUIRED: 'Please enter your full name.',
    MUST_BE_STRING: 'Full name must be a valid string.',
    MUST_BE_3_CHAR_MIN: 'Full name should be at least 3 characters long.',
    MUST_BE_50_CHAR_MAX: 'Full name cannot exceed 50 characters.',
    MUST_BE_255_CHAR_MAX: 'Full name cannot exceed 255 characters.',
    CANNOT_BE_EMPTY: 'Full name cannot be left empty.',
}

const usernameErrors = {
    IS_REQUIRED: 'Please provide a username.',
    MUST_BE_STRING: 'Username must be a valid string.',
    MUST_BE_3_CHAR_MIN: 'Username should be at least 3 characters long.',
    MUST_BE_30_CHAR_MAX: 'Username cannot exceed 30 characters.',
    MUST_BE_ALPHA_NUM: 'Username must contain only letters and numbers.',
    CANNOT_BE_EMPTY: 'Username cannot be left empty.',
}

const emailErrors = {
    IS_REQUIRED: 'Please enter your email address.',
    MUST_BE_STRING: 'Email must be a valid string.',
    MUST_BE_VALID: 'Please use a valid email address format.',
    CANNOT_BE_EMPTY: 'Email cannot be left empty.',
}

const useridErrors = {
    IS_REQUIRED: 'Please provide a user ID.',
    MUST_BE_VALID: 'User ID must be a valid.',
    MUST_BE_POSITIVE: 'User ID must be a positive number.',
    CANNOT_BE_EMPTY: 'User ID cannot be left empty.',
}

const passwordErrors = {
    REQUIRED: 'Please provide a password.',
    MUST_BE_STRING: 'Password must be a valid string.',
    MUST_BE_8_CHAR_MIN: 'Password should be at least 8 characters long.',
    MUST_BE_16_CHAR_MAX: 'Password cannot exceed 16 characters.',
    CANNOT_BE_EMPTY: 'Password cannot be empty.',
    MUST_BE_VALID:
        'Password must be 8 to 16 characters long and contain at least 1 uppercase letter and only letters and numbers.',
}

const pageErrors = {
    MUST_BE_NUMBER: 'Please provide a valid page number.',
    CANNOT_BE_EMPTY: 'Page number cannot be left empty.',
    MUST_BE_POSITIVE: 'Page number must be a positive integer.',
}

const sizeErrors = {
    MUST_BE_NUMBER: 'Please provide a valid value for the size.',
    CANNOT_BE_EMPTY: 'Size value cannot be left empty.',
    MUST_BE_POSITIVE: 'Size must be a positive integer.',
}

const areaErrors = {
    NAME: {
        IS_REQUIRED: 'Please provide the area name.',
        MUST_BE_STRING: 'The area name must be a string of 3 to 100 characters.',
        CANNOT_BE_EMPTY: 'Area name cannot be left empty.',
        MUST_BE_3_CHAR_MIN: 'Area name should be at least 3 characters long.',
        MUST_BE_50_CHAR_MAX: 'Area name cannot exceed 50 characters.',
    },
    ID: {
        IS_REQUIRED: 'Please provide the area ID.',
        MUST_BE_NUMBER: 'Area ID must be a valid number.',
        MUST_BE_POSITIVE: 'Area ID must be a positive number.',
        CANNOT_BE_EMPTY: 'Area ID cannot be left empty.',
        MUST_BE_VALID: 'Area ID must be a valid.',
    },
    NOT_FOUND: 'Area not found.',
    ALREADY_EXISTS: 'The area already exists.',
    FAILED_TO_ADD: 'Sorry, we encountered an issue while adding the area. Please try again later.',
    FAILED_TO_UPDATE:
        'Sorry, we encountered an issue while updating the area. Please try again later.',
    FAILED_TO_DELETE:
        'Sorry, we encountered an issue while deleting the area. Please try again later.',
}

const countryErrors = {
    ID: {
        IS_REQUIRED: 'Please provide the country ID.',
        MUST_BE_NUMBER: 'Country ID must be a valid number.',
        MUST_BE_POSITIVE: 'Country ID must be a positive number.',
        CANNOT_BE_EMPTY: 'Country ID cannot be left empty.',
        MUST_BE_VALID: 'Country ID must be a valid.',
    },
    NAME: {
        IS_REQUIRED: 'Please provide the country name.',
        MUST_BE_STRING: 'Country name must be a string of 3 to 100 characters.',
        CANNOT_BE_EMPTY: 'Country name cannot be left empty.',
        MUST_BE_3_CHAR_MIN: 'Country name should be at least 3 characters long.',
        MUST_BE_50_CHAR_MAX: 'Country name cannot exceed 50 characters.',
        MUST_BE_100_CHAR_MAX: 'Country name cannot exceed 100 characters.',
    },
    NOT_FOUND: 'The specified country was not found.',
    ALREADY_EXISTS: 'This country already exists.',
    FAILED_TO_ADD:
        'Sorry, we encountered an issue while adding the country. Please try again later.',
    FAILED_TO_UPDATE:
        'Sorry, we encountered an issue while updating the country. Please try again later.',
    FAILED_TO_DELETE:
        'Sorry, we encountered an issue while deleting the country. Please try again later.',
    IS_ACTIVE: {
        IS_REQUIRED: 'Please specify if the user is active.',
        MUST_BE_BOOLEAN: 'The is active value must be either true or false.',
        CANNOT_BE_EMPTY: 'The is active field cannot be left empty.',
    },
}

const avatarErrors = {
    MUST_BE_VALID_FORMAT: 'The avatar file must be in PNG, JPG, or JPEG format.',
    MUST_BE_STRING: 'Avatar path must be a valid string.',
    PATH_MUST_BE_STRING: 'Avatar path must be a valid string.',
    MUST_BE_LESS_THAN_2MB: 'The avatar file size must be less than 2MB.',
    CANNOT_BE_EMPTY: 'The avatar cannot be left empty.',
    FAILED_TO_CREATE_DIRECTORY: 'Failed to create the user avatar directory.',
    IS_REQUIRED: 'Please provide only 1 avatar.',
}

const sortByErrors = {
    MUST_BE_STRING: 'Please specify a valid sorting criteria.',
    MUST_BE_VALID: 'Sorting criteria must be a valid column.',
}

const orderByErrors = {
    MUST_BE_STRING: 'Please specify a valid sorting order (asc or desc).',
    MUST_BE_VALID: 'Sorting order must be either asc or desc.',
    CANNOT_BE_EMPTY: 'Sorting order cannot be left empty.',
}

const blogErrors = {
    TITLE: {
        IS_REQUIRED: 'Please provide a title for the blog.',
        MUST_BE_STRING: 'The title must be a string of 3 to 255 characters.',
        CANNOT_BE_EMPTY: 'The title cannot be left empty.',
        MUST_BE_3_CHAR_MIN: 'The title should be at least 3 characters long.',
        MUST_BE_255_CHAR_MAX: 'The title cannot exceed 255 characters.',
    },
    IMAGES: {
        PATH_MUST_STRING: 'The image path must be a valid string.',
        MUST_BE_VALID_FORMAT:
            'Invalid image format. Please upload images in PNG, JPG, or JPEG format.',
        IS_REQUIRED: 'At least 1 image of header and 1 image of details is required for a blog.',
        IMAGE_NOT_VALID: 'The uploaded image is not valid. Please use PNG, JPG, or JPEG format.',
        IMAGE_ARRAY: 'The images must be provided as an array.',
        CANNOT_BE_EMPTY: 'The images cannot be left empty.',
        HEADER_IMAGE_MUST_BE_ONE: 'Only 1 header image is allowed.',
    },
    SLUG: {
        IS_REQUIRED: 'Please provide a slug for the blog.',
        MUST_BE_STRING: 'The slug must be a string of 3 to 100 characters.',
        CANNOT_BE_EMPTY: 'The slug cannot be left empty.',
        MUST_BE_3_CHAR_MIN: 'The slug should be at least 3 characters long.',
        MUST_BE_100_CHAR_MAX: 'The slug cannot exceed 100 characters.',
        ALREADY_EXISTS: 'This slug already exists.',
    },
    DESC: {
        IS_REQUIRED: 'Please provide a description for the blog.',
        MUST_BE_STRING: 'The description must be a string of 3 to 255 characters.',
        CANNOT_BE_EMPTY: 'The description cannot be left empty.',
        MUST_BE_3_CHAR_MIN: 'The description should be at least 3 characters long.',
        MUST_BE_255_CHAR_MAX: 'The description cannot exceed 255 characters.',
    },
    CONTENT: {
        IS_REQUIRED: 'Please provide content for the blog.',
        MUST_BE_STRING: 'The content must be a string of at least 3 characters.',
        MUST_BE_3_CHAR_MIN: 'The content should be at least 3 characters long.',
        CANNOT_BE_EMPTY: 'The content cannot be left empty.',
    },
    ID: {
        IS_REQUIRED: 'Please specify the blog ID.',
        MUST_BE_NUMBER: 'Blog ID must be a valid number.',
        MUST_BE_VALID: 'Blog ID must be a valid.',
        MUST_BE_POSITIVE: 'Blog ID must be a positive number.',
        CANNOT_BE_EMPTY: 'The blog ID cannot be left empty.',
    },
    BAD_REQUEST:
        'To add a blog, please provide the Category, Title, Slug, Description, Content, and at least one Image Header and one Image Detail.',
    FAILED_ADD: 'We encountered an issue while trying to add the blog. Please try again later.',
    FAILED_UPDATE:
        'We encountered an issue while trying to update the blog. Please try again later.',
    FAILED_DELETE:
        'We encountered an issue while trying to delete the blog. Please try again later.',
    NOT_FOUND: 'The specified blog was not found.',
    FAILED_TO_CREATE_DIRECTORY:
        'We encountered an issue while trying to create the blog images directory.',
    FAILED_TO_FIND_DIRECTORY:
        'We encountered an issue while trying to find the blog images directory.',
    IS_ACTIVE: {
        IS_REQUIRED: 'Please specify if the user is active.',
        MUST_BE_BOOLEAN: 'The is active value must be either true or false.',
        CANNOT_BE_EMPTY: 'The is active field cannot be left empty.',
    },
}

const tourErrors = {
    ID: {
        IS_REQUIRED: 'Tour ID is required',
        MUST_BE_NUMBER: 'Tour ID must be a valid number',
        MUST_BE_POSITIVE: 'Tour ID must be a positive number',
        CANNOT_BE_EMPTY: 'Tour ID cannot be empty',
        MUST_BE_VALID: 'Tour ID must be a valid',
    },
    NAME: {
        IS_REQUIRED: 'Tour name is required. Please provide a name for the tour.',
        MUST_BE_STRING: 'Tour name must be a valid string.',
        MUST_BE_3_CHAR_MIN: 'Tour name should have at least 3 characters.',
        MUST_BE_255_CHAR_MAX: 'Tour name should not exceed 255 characters.',
        CANNOT_BE_EMPTY: 'Tour name cannot be left empty.',
    },
    PRICE: {
        IS_REQUIRED: 'Price is required. Please specify the tour price.',
        MUST_BE_STRING: 'Price must be a valid string.',
        MUST_BE_3_CHAR_MIN: 'Price should have at least 3 characters.',
        MUST_BE_255_CHAR_MAX: 'Price should not exceed 255 characters.',
        CANNOT_BE_EMPTY: 'Price cannot be left empty.',
    },
    DATE_START: {
        IS_REQUIRED: 'Start date is required. Please provide the tour start date.',
        MUST_BE_NUMBER: 'Start date must be a valid number.',
        MUST_BE_POSITIVE: 'Start date must be a positive number.',
        MUST_BE_GREATER_THAN_0: 'Start date must be greater than 0.',
        CANNOT_BE_EMPTY: 'Start date cannot be left empty.',
    },
    DATE_END: {
        IS_REQUIRED: 'End date is required. Please provide the tour end date.',
        MUST_BE_NUMBER: 'End date must be a valid number.',
        MUST_BE_POSITIVE: 'End date must be a positive number.',
        MUST_BE_GREATER_THAN_0: 'Start date must be greater than 0.',
        CANNOT_BE_EMPTY: 'End date cannot be left empty.',
    },
    DESC: {
        IS_REQUIRED: 'Description is required. Please provide a description for the tour.',
        MUST_BE_STRING: 'Description must be a valid string.',
        MUST_BE_3_CHAR_MIN: 'Description should have at least 3 characters.',
        MUST_BE_255_CHAR_MAX: 'Description should not exceed 255 characters.',
        CANNOT_BE_EMPTY: 'Description cannot be left empty.',
    },
    PLACE: {
        NAME: {
            IS_REQUIRED: 'Place name is required. Please provide a name for the tour place.',
            MUST_BE_STRING: 'Place name must be a valid string.',
            MUST_BE_3_CHAR_MIN: 'Place name should have at least 3 characters.',
            MUST_BE_255_CHAR_MAX: 'Place name should not exceed 100 characters.',
            CANNOT_BE_EMPTY: 'Place name cannot be left empty.',
        },
        IS_REQUIRED: 'Place is required. Please specify the tour place.',
        MUST_BE_ARRAY: 'Place must be an array.',
        CANNOT_BE_EMPTY: 'Place cannot be left empty.',
        MUST_BE_1_PLACE_MIN: 'At least 1 place is required for the tour.',
    },
    IMAGES: {
        PATH_MUST_BE_STRING: 'Image path must be a valid string.',
        IMAGE_NOT_VALID: 'Invalid image format. Please upload images in PNG, JPG, or JPEG format.',
        IMAGE_ARRAY: 'Images must be provided as an array.',
        CANNOT_BE_EMPTY: 'At least 1 image is required for the tour.',
        MUST_BE_VALID_FORMAT:
            'Invalid image format. Please upload images in PNG, JPG, or JPEG format.',
        IS_REQUIRED: 'At least 1 image of header and 1 image of details is required for a tour.',
        HEADER_IMAGE_MUST_BE_ONE: 'Only 1 header image is allowed.',
    },
    IS_ACTIVE: {
        MUST_BE_BOOLEAN: 'The is active value must be a valid boolean.',
        CANNOT_BE_EMPTY: 'The is active field cannot be left empty.',
    },
    NOT_FOUND: 'The requested tour was not found.',
    FAILED_TO_DELETE_DIRECTORY: 'Failed to delete the tour images directory.',
    FAILED_TO_CREATE_DIRECTORY: 'Failed to create the tour images directory.',
    IS_NOT_ACTIVE: 'The tour is not currently active.',
    BAD_REQUEST:
        'To add a tour, please provide the Name, Price, Start Date, End Date, Description, Place, Country ID and at least 1 Image Header and 1 Image Detail.',
    FAILED_TO_ADD: 'We encountered an issue while trying to add the tour. Please try again later.',
    FAILED_TO_UPDATE:
        'We encountered an issue while trying to update the tour. Please try again later.',
}

const userNameOrEmailErrors = {
    REQUIRED: 'Please enter your username or email.',
    MUST_BE_STRING: 'Username or email must be a valid string.',
    CANNOT_BE_EMPTY: 'Username or email cannot be empty.',
    MUST_BE_3_CHAR_MIN: 'Username or email should be at least 3 characters long.',
    MUST_BE_255_CHAR_MAX: 'Username or email cannot exceed 255 characters.',
    UNKNOWN_BODY_ERROR: 'An unknown error occurred with the login request. Please try again later.',
}

const errors = {
    HTTP: httpErrors,
    CATEGORY: categoryErrors,
    USER: userErrors,
    ROLE: roleErrors,
    FULL_NAME: fullNameErrors,
    USERNAME: usernameErrors,
    USERNAME_OR_EMAIL: userNameOrEmailErrors,
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
    AUTHENTICATION: {
        USERNAME_OR_EMAIL:
            'Your username or email is incorrect. Please double-check and try again.',
        PASSWORD: 'Your password is incorrect. Please verify and retry.',
    },
    DATABASE: {
        CONNECTION: 'Failed to connect to the database. Please try again later.',
    },
}

export { errors }
