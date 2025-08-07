import { User } from "~~/server/models/user"
import { UserSafeSchema } from "~~/shared/schema/user"

//

export default defineEventHandler(async (event) => {
    // --- Trust middleware for the user id from access token
    const userId = event.context.accessTokenPayload.id
    
    // --- Find user from the database
    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
        throw createError({
            statusCode: 400,
            statusMessage: "User not found.",
        })
    }

    // --- Remove the password before sending
    return UserSafeSchema.parse(user.dataValues)
})