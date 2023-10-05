import Joi from 'joi'
import { errors } from '../utils/message-error.js'

const addTourValidationSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.base': `${errors.TOUR.NAME.MUST_STRING}`,
            'string.empty': `${errors.TOUR.NAME.CANNOT_EMPTY}`,
            'string.min': `${errors.TOUR.NAME.MUST_MIN}`,
            'string.max': `${errors.TOUR.NAME.MUST_MAX}`,
            'any.required': `${errors.TOUR.NAME.IS_REQUIRED}`,
        }),
    price: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.base': `${errors.TOUR.PRICE.MUST_STRING}`,
            'string.empty': `${errors.TOUR.PRICE.CANNOT_EMPTY}`,
            'string.min': `${errors.TOUR.PRICE.MUST_MIN}`,
            'string.max': `${errors.TOUR.PRICE.MUST_MAX}`,
            'any.required': `${errors.TOUR.PRICE.IS_REQUIRED}`,
        }),
    dateStart: Joi.number()
        .min(0)
        .positive()
        .required()
        .messages({
            'number.base': `${errors.TOUR.DATE_START.MUST_NUMBER}`,
            'number.empty': `${errors.TOUR.DATE_START.CANNOT_EMPTY}`,
            'number.min': `${errors.TOUR.DATE_START.MUST_MIN}`,
            'number.positive': `${errors.TOUR.DATE_START.MUST_POSITIVE}`,
            'any.required': `${errors.TOUR.DATE_START.IS_REQUIRED}`,
        }),
    dateEnd: Joi.number()
        .min(0)
        .positive()
        .required()
        .messages({
            'number.base': `${errors.TOUR.DATE_END.MUST_NUMBER}`,
            'number.empty': `${errors.TOUR.DATE_END.CANNOT_EMPTY}`,

            'number.min': `${errors.TOUR.DATE_END.MUST_MIN}`,
            'number.positive': `${errors.TOUR.DATE_END.MUST_POSITIVE}`,
            'any.required': `${errors.TOUR.DATE_END.IS_REQUIRED}`,
        }),
    description: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.base': `${errors.TOUR.DESCRIPTION.MUST_STRING}`,
            'string.empty': `${errors.TOUR.DESCRIPTION.CANNOT_EMPTY}`,
            'string.min': `${errors.TOUR.DESCRIPTION.MUST_MIN}`,
            'string.max': `${errors.TOUR.DESCRIPTION.MUST_MAX}`,
            'any.required': `${errors.TOUR.DESCRIPTION.IS_REQUIRED}`,
        }),
    place: Joi.array()
        .items(
            Joi.string()
                .required()
                .messages({
                    'string.base': `${errors.TOUR.PLACE.NAME.MUST_STRING}`,
                    'string.empty': `${errors.TOUR.PLACE.NAME.CANNOT_EMPTY}`,
                    'string.min': `${errors.TOUR.PLACE.NAME.MUST_MIN}`,
                })
        )
        .min(1)
        .required()
        .error(new Error(`${errors.TOUR.PLACE.IS_REQUIRED}`)),
}).unknown(true)

const imagesValidationSchema = Joi.array()
    .items(
        Joi.object()
            .required()
            .keys({
                path: Joi.string()
                    .required()
                    .messages({
                        'string.base': `${errors.TOUR.IMAGES.PATH_MUST_STRING}`,
                        'string.empty': `${errors.TOUR.IMAGES.CANNOT_EMPTY}`,
                        'any.required': `${errors.TOUR.IMAGES.IS_REQUIRED}`,
                    }),
            })
            .unknown(true)
            .error(new Error(`${errors.TOUR.IMAGES.IMAGE_ARRAY}`))
    )
    .min(1)
    .required()
    .error(new Error(`${errors.TOUR.IMAGES.MUST_VALID}`))

export { addTourValidationSchema, imagesValidationSchema }
