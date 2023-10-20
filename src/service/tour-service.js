import { validate } from '../validation/validation.js'
import {
    addTourValidationSchema,
    idTourValidationSchema,
    imagesValidationSchema,
    searchTourValidationSchema,
} from '../validation/tour-validation.js'
import { prismaClient } from '../application/database.js'
import { MulterError, ResponseError } from '../utils/response-error.js'
import { errors } from '../utils/message-error.js'
import fs from 'fs/promises'

const add = async (req) => {
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

        const newTour = await prisma.tour.create({
            data: {
                name: name,
                price: price,
                dateStart: dateStart,
                dateEnd: dateEnd,
                duration: dateEnd - dateStart,
                description: description,
                TourCountry: {
                    create: {
                        countryId: countryId,
                    },
                },
                TourImages: {
                    createMany: {
                        data: tourImages.map((image) => {
                            return {
                                image: image.path,
                            }
                        }),
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
                        id: true,
                        image: true,
                    },
                },
            },
        })

        if (!newTour) {
            throw new MulterError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.TOUR.NOT_FOUND,
                tourImages
            )
        }

        for (const newTourImage in newTour.TourImages) {
            const { id: newTourImageId, image: newTourImagePath } = newTour.TourImages[newTourImage]
            for (const tourImage of tourImages) {
                if (tourImage.id === null) {
                    if (tourImage.path === newTourImagePath) {
                        tourImage.id = newTourImageId
                    }
                }
            }
        }

        const { id } = newTour

        try {
            await fs.mkdir(`public/images/tour/${id}`, { recursive: true })
        } catch (error) {
            throw new MulterError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.TOUR.FAILED_TO_CREATE_DIRECTORY,
                tourImages
            )
        }

        await Promise.all(
            tourImages.map(async (image) => {
                const { id: imageTourId, path: imagePath, filename } = image
                const oldPath = imagePath
                const newPath = `public/images/tour/${id}/${filename}`

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
                        await fs.rm(`public/images/tour/${id}`, { recursive: true, force: true })
                        await prisma.tour.deleteMany({
                            where: {
                                id: id,
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
            id: newTourId,
            name: newTourName,
            price: newTourPrice,
            dateStart: newTourDateStart,
            dateEnd: newTourDateEnd,
            duration: newTourDuration,
            description: newTourDescription,
        } = newTour

        return {
            id: newTourId,
            name: newTourName,
            price: newTourPrice,
            dateStart: newTourDateStart,
            dateEnd: newTourDateEnd,
            duration: newTourDuration,
            description: newTourDescription,
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
