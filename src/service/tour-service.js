import { validate } from '../validation/validation.js'
import {
    addTourValidationSchema,
    getTourValidationSchema,
    idTourValidationSchema,
    imagesValidationSchema,
    updateTourValidationSchema,
} from '../validation/tour-validation.js'
import { prismaClient } from '../application/database.js'
import { MulterError, MulterErrorMultipleImages, ResponseError } from '../utils/response-error.js'
import { errors } from '../utils/message-error.js'
import fs from 'fs/promises'
import { clearDirectory } from '../utils/clear-directory.js'

const add = async (req) => {
    const {
        name: nameTourExist,
        price: priceTourExist,
        dateStart: dateStartTourExist,
        dateEnd: dateEndTourExist,
        desc: descriptionTourExist,
        place: placeTourExist,
        countryId: countryIdTourExist,
        imgHead: imgHeadTourExist,
        imgDetail: imgDetailTourExist,
    } = req.body

    if (
        (!nameTourExist ||
            !priceTourExist ||
            !dateStartTourExist ||
            !dateEndTourExist ||
            !descriptionTourExist ||
            !placeTourExist ||
            !countryIdTourExist) &&
        req.files
    ) {
        throw new MulterError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.TOUR.BAD_REQUEST,
            req.files
        )
    }

    // imgHead and imgDetail should exist
    if (imgDetailTourExist === '' || imgHeadTourExist === '') {
        if (req.files) {
            throw new MulterError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.TOUR.IMAGES.IS_REQUIRED,
                req.files
            )
        } else {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.TOUR.IMAGES.IS_REQUIRED
            )
        }
    }

    const { name, price, dateStart, dateEnd, desc, place, countryId } = validate(
        addTourValidationSchema,
        req.body
    )
    const images = validate(imagesValidationSchema, req.files)

    if (
        !images.every((image) => image.fieldname === 'imgDetail' || image.fieldname === 'imgHead')
    ) {
        throw new MulterError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.TOUR.IMAGES.IS_REQUIRED,
            req.files
        )
    }

    const { imgDetail, imgHead } = images.reduce(
        (result, image) => {
            if (image.fieldname === 'imgDetail') {
                result.imgDetail.push({
                    id: null,
                    filename: image.filename,
                    path: image.path,
                })
            } else if (image.fieldname === 'imgHead') {
                result.imgHead.push({
                    filename: image.filename,
                    path: image.path,
                })
            }
            return result
        },
        { imgDetail: [], imgHead: [] }
    )

    if (imgDetail.length === 0 || imgHead.length === 0) {
        throw new MulterError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.TOUR.IMAGES.IS_REQUIRED,
            req.files
        )
    }

    if (imgHead && imgHead.length > 1) {
        throw new MulterErrorMultipleImages(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.TOUR.IMAGES.HEADER_IMAGE_MUST_BE_ONE,
            [imgDetail, imgHead]
        )
    }

    return prismaClient.$transaction(async (prisma) => {
        const findCountry = await prisma.country.findUnique({
            where: {
                id: countryId,
            },
        })

        if (!findCountry) {
            throw new MulterErrorMultipleImages(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.COUNTRY.NOT_FOUND,
                [imgDetail, imgHead]
            )
        }

        let newTour = null
        try {
            newTour = await prisma.tour.create({
                data: {
                    name: name,
                    price: price,
                    dateStart: dateStart,
                    dateEnd: dateEnd,
                    duration: dateEnd - dateStart,
                    desc: desc,
                    TourCountry: {
                        create: {
                            countryId: countryId,
                        },
                    },
                    Place: {
                        createMany: {
                            data: place.map((place) => {
                                return {
                                    name: place,
                                }
                            }),
                        },
                    },
                    imgHead: imgHead[0].path,
                    imgDetail: {
                        createMany: {
                            data: imgDetail.map((image) => {
                                const { path } = image
                                return {
                                    image: path,
                                }
                            }),
                        },
                    },
                },
                select: {
                    id: true,
                    imgDetail: {
                        select: {
                            id: true,
                            image: true,
                        },
                    },
                },
            })
        } catch (error) {
            throw new MulterErrorMultipleImages(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.TOUR.FAILED_TO_ADD,
                [imgDetail, imgHead]
            )
        }

        const { id: newTourId, imgDetail: newTourImages } = newTour

        newTourImages.forEach(({ id, image: path }) => {
            const matchingOldImage = imgDetail.find(
                (oldBlogImageDetail) =>
                    oldBlogImageDetail.id === null && oldBlogImageDetail.path === path
            )

            if (matchingOldImage) {
                matchingOldImage.id = id
            }
        })

        try {
            await fs.mkdir(`public/images/tour/${newTourId}/details`, { recursive: true })
            await fs.mkdir(`public/images/tour/${newTourId}/header`, { recursive: true })
        } catch (error) {
            throw new MulterErrorMultipleImages(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.TOUR.FAILED_TO_CREATE_DIRECTORY,
                [imgDetail, imgHead]
            )
        }

        try {
            for (const image of imgHead) {
                const { path: oldPath, filename } = image
                const newPath = `public/images/tour/${newTourId}/header/${filename}`

                await prisma.tour.update({
                    where: {
                        id: newTourId,
                    },
                    data: {
                        imgHead: newPath,
                    },
                })
                await fs.rename(oldPath, newPath)
            }
        } catch (e) {
            await prisma.tour.delete({
                where: {
                    id: newTourId,
                },
            })
            await fs.rm(`public/images/tour/${newTourId}`, { recursive: true, force: true })
            throw new MulterErrorMultipleImages(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.TOUR.FAILED_TO_ADD,
                [imgDetail, imgHead]
            )
        }

        try {
            for (const image of imgDetail) {
                const { id: IdDetailImage, path: oldPath, filename } = image
                const newPath = `public/images/tour/${newTourId}/details/${filename}`

                await prisma.tourImage.update({
                    where: {
                        id: IdDetailImage,
                    },
                    data: {
                        image: newPath,
                    },
                })
                await fs.rename(oldPath, newPath)
            }
        } catch (e) {
            await prisma.tour.delete({
                where: {
                    id: newTourId,
                },
            })
            await fs.rm(`public/images/tour/${newTourId}`, { recursive: true, force: true })
            throw new MulterErrorMultipleImages(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.TOUR.FAILED_TO_ADD,
                [imgDetail, imgHead]
            )
        }

        const result = await prisma.tour.findUnique({
            where: {
                id: newTourId,
            },
            select: {
                id: true,
                name: true,
                price: true,
                dateStart: true,
                dateEnd: true,
                duration: true,
                desc: true,
                imgHead: true,
                imgDetail: {
                    select: {
                        id: true,
                        image: true,
                    },
                },
                Place: {
                    select: {
                        name: true,
                    },
                },
                TourCountry: {
                    select: {
                        country: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        })

        const {
            id: resultId,
            name: resultName,
            price: resultPrice,
            dateStart: resultDateStart,
            dateEnd: resultDateEnd,
            duration: resultDuration,
            desc: resultDescription,
            imgHead: resultImgHead,
            imgDetail: resultImgDetail,
            Place: resultPlace,
            TourCountry: resultTourCountry,
        } = result

        return {
            id: resultId,
            name: resultName,
            price: resultPrice,
            dateStart: resultDateStart,
            dateEnd: resultDateEnd,
            duration: resultDuration,
            description: resultDescription,
            imgHead: resultImgHead,
            imgDetail: resultImgDetail,
            place: resultPlace.map((place) => place.name),
            country: resultTourCountry.map((country) => country.country.name),
        }
    })
}

const getById = async (req) => {
    const { id } = validate(idTourValidationSchema, req.params)

    return prismaClient.$transaction(async (prisma) => {
        const result = await prisma.tour.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                name: true,
                price: true,
                dateStart: true,
                dateEnd: true,
                duration: true,
                desc: true,
                imgHead: true,
                imgDetail: {
                    select: {
                        id: true,
                        image: true,
                    },
                },
                Place: {
                    select: {
                        name: true,
                    },
                },
                TourCountry: {
                    select: {
                        country: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        })

        if (!result) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.BLOG.NOT_FOUND
            )
        }

        const {
            id: resultId,
            name: resultName,
            price: resultPrice,
            dateStart: resultDateStart,
            dateEnd: resultDateEnd,
            duration: resultDuration,
            desc: resultDescription,
            imgHead: resultImgHead,
            imgDetail: resultImgDetail,
            Place: resultPlace,
            TourCountry: resultTourCountry,
        } = result

        return {
            id: resultId,
            name: resultName,
            price: resultPrice,
            dateStart: resultDateStart,
            dateEnd: resultDateEnd,
            duration: resultDuration,
            description: resultDescription,
            imgHead: resultImgHead,
            imgDetail: resultImgDetail,
            place: resultPlace.map((place) => place.name),
            country: resultTourCountry.map((country) => country.country.name),
        }
    })
}

const get = async (req) => {
    const { page, size, sortBy, orderBy, name, place, country } = validate(
        getTourValidationSchema,
        req.query
    )
    const skip = (page - 1) * size
    const filters = []

    if (sortBy) {
        if (
            sortBy !== 'id' &&
            sortBy !== 'name' &&
            sortBy !== 'price' &&
            sortBy !== 'dateStart' &&
            sortBy !== 'dateEnd'
        ) {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.SORT_BY.MUST_VALID
            )
        }
    }

    if (name) {
        filters.push({
            name: name,
        })
    }

    if (place) {
        filters.push({
            Place: {
                some: {
                    name: place,
                },
            },
        })
    }

    if (country) {
        filters.push({
            TourCountry: {
                some: {
                    country: {
                        name: country,
                    },
                },
            },
        })
    }

    return prismaClient.$transaction(async (prisma) => {
        const tours = await prisma.tour.findMany({
            where: {
                AND: filters,
            },
            select: {
                id: true,
                name: true,
                price: true,
                dateStart: true,
                dateEnd: true,
                duration: true,
                desc: true,
                imgHead: true,
                imgDetail: {
                    select: {
                        id: true,
                        image: true,
                    },
                },
                Place: {
                    select: {
                        name: true,
                    },
                },
                TourCountry: {
                    select: {
                        country: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            take: size,
            skip: skip,
            orderBy: {
                [sortBy]: orderBy,
            },
        })

        const totalItems = await prisma.tour.count({
            where: {
                AND: filters,
            },
        })
        return {
            data: tours.map((tour) => {
                const {
                    id: resultId,
                    name: resultName,
                    price: resultPrice,
                    dateStart: resultDateStart,
                    dateEnd: resultDateEnd,
                    duration: resultDuration,
                    desc: resultDescription,
                    imgHead: resultImgHead,
                    imgDetail: resultImgDetail,
                    Place: resultPlace,
                    TourCountry: resultTourCountry,
                } = tour

                return {
                    id: resultId,
                    name: resultName,
                    price: resultPrice,
                    dateStart: resultDateStart,
                    dateEnd: resultDateEnd,
                    duration: resultDuration,
                    description: resultDescription,
                    imgHead: resultImgHead,
                    imgDetail: resultImgDetail,
                    place: resultPlace.map((place) => place.name),
                    country: resultTourCountry.map((country) => country.country.name),
                }
            }),
            pagination: {
                page: page,
                total_item: totalItems,
                total_page: Math.ceil(totalItems / size),
            },
        }
    })
}

const update = async (req) => {
    const { id: tourId } = validate(idTourValidationSchema, req.params)
    const { name, price, dateStart, dateEnd, desc, place, countryId, isActive } = validate(
        updateTourValidationSchema,
        req.body
    )
    const images = validate(imagesValidationSchema, req.files)

    if (
        !images.every((image) => image.fieldname === 'imgDetail' || image.fieldname === 'imgHead')
    ) {
        throw new MulterError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.TOUR.IMAGES.IS_REQUIRED,
            req.files
        )
    }

    const { imgDetail, imgHead } = images.reduce(
        (result, image) => {
            if (image.fieldname === 'imgDetail') {
                result.imgDetail.push({
                    id: null,
                    filename: image.filename,
                    path: image.path,
                })
            } else if (image.fieldname === 'imgHead') {
                result.imgHead.push({
                    filename: image.filename,
                    path: image.path,
                })
            }
            return result
        },
        { imgDetail: [], imgHead: [] }
    )

    if (imgDetail.length === 0 || imgHead.length === 0) {
        throw new MulterError(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.TOUR.IMAGES.IS_REQUIRED,
            req.files
        )
    }

    if (imgHead && imgHead.length > 1) {
        throw new MulterErrorMultipleImages(
            errors.HTTP.CODE.BAD_REQUEST,
            errors.HTTP.STATUS.BAD_REQUEST,
            errors.TOUR.IMAGES.HEADER_IMAGE_MUST_BE_ONE,
            [imgDetail, imgHead]
        )
    }

    return prismaClient.$transaction(async (prisma) => {
        const findTour = await prisma.tour.findUnique({
            where: {
                id: tourId,
            },
            select: {
                TourCountry: {
                    select: {
                        id: true,
                    },
                },
            },
        })

        if (!findTour) {
            throw new MulterErrorMultipleImages(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.TOUR.NOT_FOUND,
                [imgDetail, imgHead]
            )
        }

        if (findTour.isActive === false) {
            throw new MulterErrorMultipleImages(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.TOUR.IS_NOT_ACTIVE,
                [imgDetail, imgHead]
            )
        }

        if (countryId) {
            const findCountry = await prisma.country.findUnique({
                where: {
                    id: countryId,
                },
            })

            if (!findCountry) {
                throw new MulterErrorMultipleImages(
                    errors.HTTP.CODE.NOT_FOUND,
                    errors.HTTP.STATUS.NOT_FOUND,
                    errors.COUNTRY.NOT_FOUND,
                    [imgDetail, imgHead]
                )
            }
        }

        try {
            await fs.access(`public/images/tour/${tourId}/details`)
            await fs.access(`public/images/tour/${tourId}/header`)
        } catch (error) {
            throw new MulterErrorMultipleImages(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.TOUR.FAILED_TO_FIND_DIRECTORY,
                [imgDetail, imgHead]
            )
        }

        let updatedTour = null
        try {
            if (place.length > 0) {
                await prisma.place.deleteMany({
                    where: {
                        tourId: tourId,
                    },
                })
            }
            await prisma.tourImage.deleteMany({
                where: {
                    tourId: tourId,
                },
            })
            updatedTour = await prisma.tour.update({
                where: {
                    id: tourId,
                },
                data: {
                    name: name,
                    price: price,
                    dateStart: dateStart,
                    dateEnd: dateEnd,
                    duration: dateEnd - dateStart,
                    desc: desc,
                    Place: {
                        createMany: {
                            data: place.map((place) => {
                                return {
                                    name: place,
                                }
                            }),
                        },
                    },
                    imgHead: imgHead[0].path,
                    imgDetail: {
                        createMany: {
                            data: imgDetail.map((image) => {
                                const { path } = image
                                return {
                                    image: path,
                                }
                            }),
                        },
                    },
                    isActive: isActive,
                    TourCountry: {
                        update: {
                            where: {
                                id: findTour.TourCountry[0].id,
                                tourId: tourId,
                            },
                            data: {
                                countryId: countryId,
                            },
                        },
                    },
                },
                select: {
                    id: true,
                    imgDetail: {
                        select: {
                            id: true,
                            image: true,
                        },
                    },
                },
            })
        } catch (e) {
            throw new MulterErrorMultipleImages(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.TOUR.FAILED_TO_UPDATE,
                [imgDetail, imgHead]
            )
        }

        const { imgDetail: newTourImages } = updatedTour

        newTourImages.forEach(({ id, image: path }) => {
            const matchingOldImage = imgDetail.find(
                (oldBlogImageDetail) =>
                    oldBlogImageDetail.id === null && oldBlogImageDetail.path === path
            )

            if (matchingOldImage) {
                matchingOldImage.id = id
            }
        })

        try {
            await clearDirectory(`public/images/tour/${tourId}/header`)
            for (const image of imgHead) {
                const { path: oldPath, filename } = image
                const newPath = `public/images/tour/${tourId}/header/${filename}`

                await prisma.tour.update({
                    where: {
                        id: tourId,
                    },
                    data: {
                        imgHead: newPath,
                    },
                })
                await fs.rename(oldPath, newPath)
            }
        } catch (e) {
            await prisma.tour.delete({
                where: {
                    id: tourId,
                },
            })
            await fs.rm(`public/images/tour/${tourId}`, { recursive: true, force: true })
            throw new MulterErrorMultipleImages(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.TOUR.FAILED_TO_UPDATE,
                [imgDetail, imgHead]
            )
        }

        try {
            await clearDirectory(`public/images/tour/${tourId}/details`)
            for (const image of imgDetail) {
                const { id: IdDetailImage, path: oldPath, filename } = image
                const newPath = `public/images/tour/${tourId}/details/${filename}`

                await prisma.tourImage.update({
                    where: {
                        id: IdDetailImage,
                    },
                    data: {
                        image: newPath,
                    },
                })
                await fs.rename(oldPath, newPath)
            }
        } catch (e) {
            await prisma.tour.delete({
                where: {
                    id: tourId,
                },
            })
            await fs.rm(`public/images/tour/${tourId}`, { recursive: true, force: true })
            throw new MulterErrorMultipleImages(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.TOUR.FAILED_TO_UPDATE,
                [imgDetail, imgHead]
            )
        }

        const result = await prisma.tour.findUnique({
            where: {
                id: tourId,
            },
            select: {
                id: true,
                name: true,
                price: true,
                dateStart: true,
                dateEnd: true,
                duration: true,
                desc: true,
                imgHead: true,
                imgDetail: {
                    select: {
                        id: true,
                        image: true,
                    },
                },
                Place: {
                    select: {
                        name: true,
                    },
                },
                TourCountry: {
                    select: {
                        country: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        })

        const {
            id: resultId,
            name: resultName,
            price: resultPrice,
            dateStart: resultDateStart,
            dateEnd: resultDateEnd,
            duration: resultDuration,
            desc: resultDescription,
            imgHead: resultImgHead,
            imgDetail: resultImgDetail,
            Place: resultPlace,
            TourCountry: resultTourCountry,
        } = result

        return {
            id: resultId,
            name: resultName,
            price: resultPrice,
            dateStart: resultDateStart,
            dateEnd: resultDateEnd,
            duration: resultDuration,
            description: resultDescription,
            imgHead: resultImgHead,
            imgDetail: resultImgDetail,
            place: resultPlace.map((place) => place.name),
            country: resultTourCountry.map((country) => country.country.name),
        }
    })
}

const remove = async (req) => {
    const { id } = validate(idTourValidationSchema, req.params)

    return prismaClient.$transaction(async (prisma) => {
        const findTour = await prisma.tour.findUnique({
            where: {
                id: id,
            },
            select: {
                imgDetail: {
                    select: {
                        id: true,
                        image: true,
                    },
                },
            },
        })

        if (!findTour) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.TOUR.NOT_FOUND
            )
        }

        await prisma.tour.delete({
            where: {
                id: id,
            },
        })

        await prisma.tourImage.deleteMany({
            where: {
                tourId: id,
            },
        })

        try {
            await fs.rm(`public/images/tour/${id}`, { recursive: true, force: true })
        } catch (error) {
            throw new ResponseError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.TOUR.FAILED_TO_DELETE_DIRECTORY
            )
        }
    })
}

export default { add, getById, get, remove, update }
