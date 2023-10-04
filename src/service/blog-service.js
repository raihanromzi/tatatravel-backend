import { validate } from '../validation/validation.js'
import { addBlogValidationSchema, imagesValidationSchema } from '../validation/blog-validation.js'
import { ResponseError } from '../utils/response-error.js'
import { prismaClient } from '../application/database.js'
import { errors } from '../utils/message-error.js'
import fs from 'fs/promises'

const add = async (req) => {
    const blog = validate(addBlogValidationSchema, req.body)
    const images = validate(imagesValidationSchema, req.files)
    const blogImages = images.map((image) => {
        return image.path
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
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.USER.NOT_FOUND
            )
        }

        const findCategory = await prisma.category.findUnique({
            where: {
                id: categoryId,
            },
        })

        if (!findCategory) {
            throw new ResponseError(
                errors.HTTP.CODE.NOT_FOUND,
                errors.HTTP.STATUS.NOT_FOUND,
                errors.CATEGORY.NOT_FOUND
            )
        }

        const validSlug = slug.split(' ').join('-')

        const findSlug = await prisma.blog.findUnique({
            where: {
                slug: validSlug,
            },
        })

        if (findSlug) {
            throw new ResponseError(
                errors.HTTP.CODE.BAD_REQUEST,
                errors.HTTP.STATUS.BAD_REQUEST,
                errors.BLOG.SLUG.ALREADY_EXISTS
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
            },
            select: {
                id: true,
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

        const { id } = newBlog

        await fs.mkdir(`public/images/blog/${id}`, { recursive: true })

        const blogImagesNewPath = await Promise.all(
            blogImages.map(async (image) => {
                const oldPath = image

                const newPath = `public/images/blog/${id}/${image.split('/')[3]}`

                try {
                    await fs.rename(oldPath, newPath)
                    return newPath
                } catch (e) {
                    const deleteBlogAndImages = async () => {
                        await fs.rmdir(`public/images/blog/${id}`)
                        await prisma.blog.delete({
                            where: {
                                id: id,
                            },
                        })
                        for (const image of blogImages) {
                            await fs.unlink(image)
                        }
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

        const newImages = await prisma.blogImage.createMany({
            data: await Promise.all(
                blogImagesNewPath.map((image) => {
                    return {
                        blogId: id,
                        image: image,
                    }
                })
            ),
        })

        if (!newImages) {
            await prisma.blog.delete({
                where: {
                    id: id,
                },
            })

            await fs.rmdir(`public/images/blog/${id}`)

            throw new ResponseError(
                errors.HTTP.CODE.INTERNAL_SERVER_ERROR,
                errors.HTTP.STATUS.INTERNAL_SERVER_ERROR,
                errors.BLOG.FAILED_ADD
            )
        }

        return newBlog
    })
}

export default { add }
