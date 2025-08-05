import { z } from "zod"
import { User } from "~~/server/models/user"

//

export default defineEventHandler(async (event) => {
    // --- Get and validate params
    const params = getRouterParams(event)
    const ParamsSchema = z.object({ email: z.string().email() })
    const paramsResult = ParamsSchema.safeParse(params)

    if (!paramsResult.success) {
        throw createError({
            statusCode: 400,
            message: "Invalid email provided.",
        })
    }

    // --- Find user with such email
    const { email } = paramsResult.data
    const user = await User.findOne({ where: { email } })

    if (user != null) {
        throw createError({
            statusCode: 400,
            message: "User email already in use.",
        })
    }

    // --- Return nothing
    return sendNoContent(event)
})