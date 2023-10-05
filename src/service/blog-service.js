import { validate } from '../validation/validation.js'
import { addBlogValidationSchema, imagesValidationSchema } from '../validation/blog-validation.js'
import { MulterError, ResponseError } from '../utils/response-error.js'
import { prismaClient } from '../application/database.js'
import { errors } from '../utils/message-error.js'
import fs from 'fs/promises'

const add = async (req) => {
    const blog = validate(addBlogValidationSchema, req.body)
    const images = validate(imagesValidationSchema, req.files)
    const blogImages = images.map((image) => {
        return {
            id: null,
            filename: image.filename,
            path: image.path,
        }
    })
    const { id: userId } = req.user
    const { categoryId, title, slug, description, content } = blog

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
                blogImages
            )
        }

        const findCategory = await prisma.category.findUnique({
            where: {
                id: categoryId,
            },
        })

        if (!findCategory) {
            throw new MulterError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.CATEGORY.NOT_FOUND,
                blogImages
            )
        }

        const validSlug = slug.split(' ').join('-')

        const findSlug = await prisma.blog.findUnique({
            where: {
                slug: validSlug,
            },
        })

        if (findSlug) {
            throw new MulterError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.BLOG.SLUG.ALREADY_EXISTS,
                blogImages
            )
        }

        const newBlog = await prisma.blog.create({
            data: {
                user: {
                    connect: {
                        id: userId,
                    },
                },
                category: {
                    connect: {
                        id: categoryId,
                    },
                },
                title: title,
                slug: validSlug,
                description: description,
                content: content,
                BlogImage: {
                    createMany: {
                        data: blogImages.map((image) => {
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
                BlogImage: {
                    select: {
                        id: true,
                        image: true,
                    },
                },
                title: true,
                slug: true,
                description: true,
            },
        })

        if (!newBlog) {
            throw new ResponseError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.BLOG.FAILED_ADD
            )
        }

        for (const image in newBlog.BlogImage) {
            const { id, image: path } = newBlog.BlogImage[image]
            for (const image of blogImages) {
                if (image.id === null) {
                    if (image.path === path) {
                        image.id = id
                    }
                }
            }
        }

        const { id } = newBlog

        try {
            await fs.mkdir(`public/images/blog/${id}`, { recursive: true })
        } catch (error) {
            throw new ResponseError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.BLOG.FAILED_TO_CREATE_DIRECTORY
            )
        }

        await Promise.all(
            blogImages.map(async (image) => {
                const { path, filename, id: imageBlogId } = image
                const oldPath = path
                const newPath = `public/images/blog/${id}/${filename}`

                try {
                    await fs.rename(oldPath, newPath)
                    await prisma.blogImage.update({
                        where: {
                            id: imageBlogId,
                        },
                        data: {
                            image: newPath,
                        },
                    })
                    return newPath
                } catch (e) {
                    const deleteBlogAndImages = async () => {
                        await fs.rm(`public/images/blog/${id}`, { recursive: true, force: true })
                        await prisma.blog.deleteMany({
                            where: {
                                id: id,
                            },
                        })
                        await fs.rm(oldPath, { recursive: true, force: true })
                    }

                    return deleteBlogAndImages()
                        .then(() => {
                            throw new ResponseError(
                                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                                errors.BLOG.FAILED_ADD
                            )
                        })
                        .catch((error) => {
                            throw new ResponseError(
                                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                                error
                            )
                        })
                }
            })
        )

        return newBlog
    })
}

export default { add }
