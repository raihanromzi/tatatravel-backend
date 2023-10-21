import { validate } from '../validation/validation.js'
import {
    addTourValidationSchema,
    idTourValidationSchema,
    imagesValidationSchema,
    searchTourValidationSchema,
} from '../validation/tour-validation.js'
import { prismaClient } from '../application/database.js'
import { MulterError, MulterErrorMultipleImages, ResponseError } from '../utils/response-error.js'
import { errors } from '../utils/message-error.js'
import fs from 'fs/promises'

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
        const result = await prisma.tour.findMany({
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
                description: true,
                TourImages: {
                    select: {
                        image: true,
                    },
                },
                Place: {
                    select: {
                        name: true,
                    },
                },
                TourCountry: {
                    where: {
                        tourId: id,
                    },
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

        if (result.length === 0) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.TOUR.NOT_FOUND
            )
        }
        return result
    })
}

const get = async (req) => {
    const query = validate(searchTourValidationSchema, req.query)

    const { page, size, sortBy, orderBy, name } = query
    const skip = (page - 1) * size
    const filters = []

    if (sortBy) {
        if (
            sortBy !== 'id' &&
            sortBy !== 'name' &&
            sortBy !== 'price' &&
            sortBy !== 'dateStart' &&
            sortBy !== 'dateEnd' &&
            sortBy !== 'duration'
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
            description: {
                contains: name,
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
                description: true,
                TourImages: {
                    select: {
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
            data: tours,
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
    const tour = validate(addTourValidationSchema, req.body)
    const images = validate(imagesValidationSchema, req.files)
    const tourImages = images.map((image) => {
        return {
            id: null,
            filename: image.filename,
            path: image.path,
        }
    })
    const { id: userId } = req.user
    const { name, price, dateStart, dateEnd, description, place, countryId } = tour
    const data = {}

    if (name) {
        data.name = name
    }

    if (price) {
        data.price = price
    }

    if (dateStart) {
        data.dateStart = dateStart
    }

    if (dateEnd) {
        data.dateEnd = dateEnd
    }

    if (description) {
        data.description = description
    }

    if (place) {
        data.Place = {
            createMany: {
                data: place.map((place) => {
                    return {
                        name: place,
                    }
                }),
            },
        }
    }

    if (countryId) {
        data.TourCountry = {
            create: {
                countryId: countryId,
            },
        }
    }

    if (tourImages.length > 0) {
        data.TourImages = {
            createMany: {
                data: tourImages.map((image) => {
                    return {
                        image: image.path,
                    }
                }),
            },
        }
    }

    return prismaClient.$transaction(async (prisma) => {
        const findUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        })

        if (!findUser) {
            throw new MulterError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.USER.NOT_FOUND,
                tourImages
            )
        }

        const findCountry = await prisma.country.findUnique({
            where: {
                id: countryId,
            },
        })

        if (!findCountry) {
            throw new MulterError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.COUNTRY.NOT_FOUND,
                tourImages
            )
        }

        const findTour = await prisma.tour.findUnique({
            where: {
                id: tourId,
            },
        })

        if (!findTour) {
            throw new MulterError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.TOUR.NOT_FOUND,
                tourImages
            )
        }

        const { isActive } = findTour

        if (isActive === false) {
            throw new MulterError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.TOUR.IS_NOT_ACTIVE,
                tourImages
            )
        }

        try {
            await fs.access(`public/images/tour/${tourId}`)
        } catch (error) {
            throw new MulterError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.TOUR.FAILED_TO_FIND_DIRECTORY,
                tourImages
            )
        }

        const updatedTour = await prisma.tour.update({
            where: {
                id: tourId,
            },
            data: data,
            select: {
                id: true,
                name: true,
                price: true,
                dateStart: true,
                dateEnd: true,
                duration: true,
                description: true,
                TourImages: {
                    select: {
                        id: true,
                        image: true,
                    },
                },
            },
        })

        if (!updatedTour) {
            throw new MulterError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.TOUR.NOT_FOUND,
                tourImages
            )
        }

        for (const newTourImage in updatedTour.TourImages) {
            const { id: newTourImageId, image: newTourImagePath } =
                updatedTour.TourImages[newTourImage]
            for (const tourImage of tourImages) {
                if (tourImage.id === null) {
                    if (tourImage.path === newTourImagePath) {
                        tourImage.id = newTourImageId
                    }
                }
            }
        }

        await Promise.all(
            tourImages.map(async (image) => {
                const { id: imageTourId, path: imagePath, filename } = image
                const oldPath = imagePath
                const newPath = `public/images/tour/${tourId}/${filename}`

                try {
                    await fs.rename(oldPath, newPath)
                    await prisma.tourImage.update({
                        where: {
                            id: imageTourId,
                        },
                        data: {
                            image: newPath,
                        },
                    })
                    return newPath
                } catch (e) {
                    const deleteTourAndImages = async () => {
                        await fs.rm(`public/images/tour/${tourId}`, {
                            recursive: true,
                            force: true,
                        })
                        await prisma.tour.deleteMany({
                            where: {
                                id: tourId,
                            },
                        })
                        await fs.rm(oldPath, { recursive: true, force: true })
                    }

                    return deleteTourAndImages()
                        .then(() => {
                            throw new MulterError(
                                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                                errors.TOUR.FAILED_ADD,
                                tourImages
                            )
                        })
                        .catch((error) => {
                            throw new MulterError(
                                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                                error,
                                tourImages
                            )
                        })
                }
            })
        )

        const {
            id: updatedTourId,
            name: updatedTourName,
            price: updatedTourPrice,
            dateStart: updatedTourDateStart,
            dateEnd: updatedTourDateEnd,
            duration: updatedTourDuration,
            description: updatedTourDescription,
        } = updatedTour

        return {
            id: updatedTourId,
            name: updatedTourName,
            price: updatedTourPrice,
            dateStart: updatedTourDateStart,
            dateEnd: updatedTourDateEnd,
            duration: updatedTourDuration,
            description: updatedTourDescription,
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
