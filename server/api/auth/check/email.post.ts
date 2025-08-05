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

    // --- Count user with such email
    const { email } = bodyResult.data
    const count = await User.count({ where: { email } })

    // --- Return state
    return count > 0
})