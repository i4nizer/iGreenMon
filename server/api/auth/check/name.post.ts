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
            statusMessage: "Invalid name provided.",
        })
    }

    // --- Count user with such name
    const { name } = bodyResult.data
    const count = await User.count({ where: { name } })

    // --- Return state
    return count <= 0
})