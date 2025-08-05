import { User } from "~~/server/models/user"
import { UserSchema } from "~~/shared/schema/user"

//

export default defineEventHandler(async (event) => {
    // --- Validation
    const body = await readBody(event)
    const bodyResult = UserSchema.pick({ email: true }).safeParse(body)

    if (!bodyResult.success) {
        throw createError({
            statusCode: 400,
            message: "Invalid email provided.",
        })
    }

    // --- Find user with such email
    const { email } = bodyResult.data
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