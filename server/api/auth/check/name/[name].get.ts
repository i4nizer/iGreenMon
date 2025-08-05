import { z } from "zod"
import { User } from "~~/server/models/user"

//

export default defineEventHandler(async (event) => {
    // --- Get and validate params
    const params = getRouterParams(event)
    const ParamsSchema = z.object({ name: z.string().min(1) })
    const paramsResult = ParamsSchema.safeParse(params)

    if (!paramsResult.success) {
        throw createError({
            statusCode: 400,
            message: "Invalid name provided.",
        })
    }

    // --- Find user with such name
    const { name } = paramsResult.data
    const user = await User.findOne({ where: { name } })

    if (user != null) {
        throw createError({
            statusCode: 400,
            message: "User name already taken.",
        })
    }

    // --- Return nothing
    return sendNoContent(event)
})