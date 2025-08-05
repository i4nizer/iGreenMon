import { User } from "~~/server/models/user"
import { UserSchema } from "~~/shared/schema/user"

//

export default defineEventHandler(async (event) => {
    // --- Validation
    const body = await readBody(event)
    const bodyResult = UserSchema.pick({ name: true }).safeParse(body)

    if (!bodyResult.success) {
        throw createError({
            statusCode: 400,
            message: "Invalid name provided.",
        })
    }

    // --- Find user with such name
    const { name } = bodyResult.data
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