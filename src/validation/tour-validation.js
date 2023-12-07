import Joi from 'joi'
import { errors } from '../utils/message-error.js'

const addTourValidationSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.base': `${errors.TOUR.NAME.MUST_BE_STRING}`,
            'string.empty': `${errors.TOUR.NAME.CANNOT_BE_EMPTY}`,
            'string.min': `${errors.TOUR.NAME.MUST_BE_3_CHAR_MIN}`,
            'string.max': `${errors.TOUR.NAME.MUST_BE_255_CHAR_MAX}`,
            'any.required': `${errors.TOUR.NAME.IS_REQUIRED}`,
        }),
    price: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.base': `${errors.TOUR.PRICE.MUST_BE_STRING}`,
            'string.empty': `${errors.TOUR.PRICE.CANNOT_BE_EMPTY}`,
            'string.min': `${errors.TOUR.PRICE.MUST_BE_3_CHAR_MIN}`,
            'string.max': `${errors.TOUR.PRICE.MUST_BE_255_CHAR_MAX}`,
            'any.required': `${errors.TOUR.PRICE.IS_REQUIRED}`,
        }),
    dateStart: Joi.number()
        .min(1)
        .positive()
        .required()
        .messages({
            'number.base': `${errors.TOUR.DATE_START.MUST_BE_NUMBER}`,
            'number.empty': `${errors.TOUR.DATE_START.CANNOT_BE_EMPTY}`,
            'number.min': `${errors.TOUR.DATE_START.MUST_BE_GREATER_THAN_0}`,
            'number.positive': `${errors.TOUR.DATE_START.MUST_BE_POSITIVE}`,
            'any.required': `${errors.TOUR.DATE_START.IS_REQUIRED}`,
        }),
    dateEnd: Joi.number()
        .min(1)
        .positive()
        .required()
        .messages({
            'number.base': `${errors.TOUR.DATE_END.MUST_BE_NUMBER}`,
            'number.empty': `${errors.TOUR.DATE_END.CANNOT_BE_EMPTY}`,
            'number.min': `${errors.TOUR.DATE_END.MUST_BE_GREATER_THAN_0}`,
            'number.positive': `${errors.TOUR.DATE_END.MUST_BE_POSITIVE}`,
            'any.required': `${errors.TOUR.DATE_END.IS_REQUIRED}`,
        }),
    desc: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.base': `${errors.TOUR.DESC.MUST_BE_STRING}`,
            'string.empty': `${errors.TOUR.DESC.CANNOT_BE_EMPTY}`,
            'string.min': `${errors.TOUR.DESC.MUST_BE_3_CHAR_MIN}`,
            'string.max': `${errors.TOUR.DESC.MUST_BE_255_CHAR_MAX}`,
            'any.required': `${errors.TOUR.DESC.IS_REQUIRED}`,
        }),
    place: Joi.array()
        .items(
            Joi.string()
                .min(3)
                .max(255)
                .messages({
                    'string.base': `${errors.TOUR.PLACE.NAME.MUST_BE_STRING}`,
                    'string.empty': `${errors.TOUR.PLACE.NAME.CANNOT_BE_EMPTY}`,
                    'string.min': `${errors.TOUR.PLACE.NAME.MUST_BE_3_CHAR_MIN}`,
                    'string.max': `${errors.TOUR.PLACE.NAME.MUST_BE_255_CHAR_MAX}`,
                })
        )
        .min(1)
        .required()
        .messages({
            'array.base': `${errors.TOUR.PLACE.MUST_BE_ARRAY}`,
            'array.min': `${errors.TOUR.PLACE.MUST_BE_1_PLACE_MIN}`,
            'any.empty': `${errors.TOUR.PLACE.CANNOT_BE_EMPTY}`,
            'any.required': `${errors.TOUR.PLACE.IS_REQUIRED}`,
        }),
    countryId: Joi.string().required().messages({
        'string.base': errors.COUNTRY.ID.MUST_BE_VALID,
        'any.required': errors.COUNTRY.ID.IS_REQUIRED,
    }),
    slug: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.base': `${errors.TOUR.SLUG.MUST_BE_STRING}`,
            'string.empty': `${errors.TOUR.SLUG.CANNOT_BE_EMPTY}`,
            'string.min': `${errors.TOUR.SLUG.MUST_BE_3_CHAR_MIN}`,
            'string.max': `${errors.TOUR.SLUG.MUST_BE_100_CHAR_MAX}`,
            'any.required': `${errors.TOUR.SLUG.IS_REQUIRED}`,
        }),
    imgHead: Joi.string()
        .empty('')
        .messages({
            'string.base': `${errors.TOUR.IMAGES.IS_REQUIRED}`,
        }),
    imgDetail: Joi.string()
        .empty('')
        .messages({
            'string.base': `${errors.TOUR.IMAGES.IS_REQUIRED}`,
        }),
}).messages({
    'object.unknown': errors.HTTP.MESSAGE.UNKNOWN_BODY_ERROR,
})

const imagesValidationSchema = Joi.array()
    .items(
        Joi.object()
            .required()
            .keys({
                path: Joi.string()
                    .required()
                    .messages({
                        'string.base': `${errors.TOUR.IMAGES.PATH_MUST_STRING}`,
                        'string.empty': `${errors.TOUR.IMAGES.CANNOT_BE_EMPTY}`,
                        'any.required': `${errors.TOUR.IMAGES.IS_REQUIRED}`,
                    }),
            })
            .unknown(true)
    )
    .messages({
        'array.base': `${errors.TOUR.IMAGES.MUST_BE_VALID_FORMAT}`,
        'array.includesRequiredUnknowns': `${errors.TOUR.IMAGES.MUST_BE_VALID_FORMAT}`,
    })

const idTourValidationSchema = Joi.object({
    id: Joi.string()
        .required()
        .messages({
            'string.base': `${errors.TOUR.ID.MUST_BE_VALID}`,
            'any.required': `${errors.TOUR.ID.IS_REQUIRED}`,
        }),
}).messages({
    'object.unknown': `${errors.HTTP.MESSAGE.UNKNOWN_BODY_ERROR}`,
})

const getTourValidationSchema = Joi.object({
    page: Joi.number().min(1).positive().default(1).messages({
        'number.base': errors.PAGE.MUST_BE_NUMBER,
        'number.empty': errors.PAGE.CANNOT_BE_EMPTY,
        'number.positive': errors.PAGE.MUST_BE_POSITIVE,
    }),
    size: Joi.number().min(1).positive().max(100).default(10).messages({
        'number.base': errors.SIZE.MUST_BE_NUMBER,
        'number.empty': errors.SIZE.CANNOT_BE_EMPTY,
        'number.positive': errors.SIZE.MUST_BE_POSITIVE,
    }),
    sortBy: Joi.string()
        .optional()
        .default('createdAt')
        .empty('')
        .messages({
            'string.base': `${errors.SORT_BY.MUST_BE_STRING}`,
            'any.only': `${errors.SORT_BY.MUST_BE_VALID}`,
        }),
    orderBy: Joi.string()
        .valid('asc', 'desc')
        .optional()
        .default('asc')
        .messages({
            'string.base': `${errors.ORDER_BY.MUST_BE_STRING}`,
            'any.valid': `${errors.ORDER_BY.MUST_BE_VALID}`,
            'string.empty': `${errors.ORDER_BY.CANNOT_BE_EMPTY}`,
            'any.only': `${errors.ORDER_BY.MUST_BE_VALID}`,
        }),
}).unknown(true)

const updateTourValidationSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(255)
        .optional()
        .messages({
            'string.base': `${errors.TOUR.NAME.MUST_BE_STRING}`,
            'string.empty': `${errors.TOUR.NAME.CANNOT_BE_EMPTY}`,
            'string.min': `${errors.TOUR.NAME.MUST_BE_3_CHAR_MIN}`,
            'string.max': `${errors.TOUR.NAME.MUST_BE_255_CHAR_MAX}`,
        }),
    price: Joi.string()
        .min(3)
        .max(255)
        .optional()
        .messages({
            'string.base': `${errors.TOUR.PRICE.MUST_BE_STRING}`,
            'string.empty': `${errors.TOUR.PRICE.CANNOT_BE_EMPTY}`,
            'string.min': `${errors.TOUR.PRICE.MUST_BE_3_CHAR_MIN}`,
            'string.max': `${errors.TOUR.PRICE.MUST_BE_255_CHAR_MAX}`,
        }),
    dateStart: Joi.number()
        .min(1)
        .positive()
        .optional()
        .messages({
            'number.base': `${errors.TOUR.DATE_START.MUST_BE_NUMBER}`,
            'number.empty': `${errors.TOUR.DATE_START.CANNOT_BE_EMPTY}`,
            'number.min': `${errors.TOUR.DATE_START.MUST_BE_GREATER_THAN_0}`,
            'number.positive': `${errors.TOUR.DATE_START.MUST_BE_POSITIVE}`,
        }),
    dateEnd: Joi.number()
        .when('dateStart', {
            is: Joi.number().required(),
            then: Joi.number()
                .min(1)
                .positive()
                .required()
                .messages({
                    'number.base': `${errors.TOUR.DATE_END.MUST_BE_NUMBER}`,
                    'number.empty': `${errors.TOUR.DATE_END.CANNOT_BE_EMPTY}`,
                    'number.min': `${errors.TOUR.DATE_END.MUST_BE_GREATER_THAN_0}`,
                    'number.positive': `${errors.TOUR.DATE_END.MUST_BE_POSITIVE}`,
                    'any.required': `${errors.TOUR.DATE_END.IS_REQUIRED}`,
                }),
            otherwise: Joi.forbidden(),
        })
        .messages({
            'any.unknown': `${errors.TOUR.DATE_START.IS_REQUIRED}`,
        }),
    desc: Joi.string()
        .min(3)
        .max(255)
        .optional()
        .messages({
            'string.base': `${errors.TOUR.DESC.MUST_BE_STRING}`,
            'string.empty': `${errors.TOUR.DESC.CANNOT_BE_EMPTY}`,
            'string.min': `${errors.TOUR.DESC.MUST_BE_3_CHAR_MIN}`,
            'string.max': `${errors.TOUR.DESC.MUST_BE_255_CHAR_MAX}`,
        }),
    slug: Joi.string()
        .optional()
        .min(3)
        .max(100)
        .messages({
            'string.base': `${errors.TOUR.SLUG.MUST_BE_STRING}`,
            'string.empty': `${errors.TOUR.SLUG.CANNOT_BE_EMPTY}`,
            'string.min': `${errors.TOUR.SLUG.MUST_BE_3_CHAR_MIN}`,
            'string.max': `${errors.TOUR.SLUG.MUST_BE_100_CHAR_MAX}`,
        }),
    isActive: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': `${errors.TOUR.IS_ACTIVE.MUST_BE_BOOLEAN}`,
            'boolean.empty': `${errors.USER.IS_ACTIVE.CANNOT_BE_EMPTY}`,
        }),
    place: Joi.array()
        .items(
            Joi.string()
                .min(3)
                .max(255)
                .messages({
                    'string.base': `${errors.TOUR.PLACE.NAME.MUST_BE_STRING}`,
                    'string.empty': `${errors.TOUR.PLACE.NAME.CANNOT_BE_EMPTY}`,
                    'string.min': `${errors.TOUR.PLACE.NAME.MUST_BE_3_CHAR_MIN}`,
                    'string.max': `${errors.TOUR.PLACE.NAME.MUST_BE_255_CHAR_MAX}`,
                })
        )
        .optional()
        .min(1)
        .messages({
            'array.base': `${errors.TOUR.PLACE.MUST_BE_ARRAY}`,
            'array.min': `${errors.TOUR.PLACE.MUST_BE_1_PLACE_MIN}`,
            'any.empty': `${errors.TOUR.PLACE.CANNOT_BE_EMPTY}`,
        }),
    countryId: Joi.string().optional().messages({
        'string.base': errors.COUNTRY.ID.MUST_BE_VALID,
    }),
    imgHead: Joi.string()
        .empty('')
        .messages({
            'string.base': `${errors.TOUR.IMAGES.IS_REQUIRED}`,
        }),
    imgDetail: Joi.string()
        .empty('')
        .messages({
            'string.base': `${errors.TOUR.IMAGES.IS_REQUIRED}`,
        }),
}).messages({
    'object.unknown': errors.HTTP.MESSAGE.UNKNOWN_BODY_ERROR,
})

export {
    addTourValidationSchema,
    imagesValidationSchema,
    idTourValidationSchema,
    getTourValidationSchema,
    updateTourValidationSchema,
}
