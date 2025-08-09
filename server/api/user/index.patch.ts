import { Op } from "sequelize"
import { User } from "~~/server/models/user"
import { UserSafeSchema, UserUpdateSchema } from "~~/shared/schema/user"

//

export default defineEventHandler(async (event) => {
	// --- Validate data
	const body = await readBody(event)
	const bodyResult = UserUpdateSchema.safeParse(body)
	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: bodyResult.error.message,
		})
	}

	// --- Check for user with same name
	const userId = event.context.accessTokenPayload.id
	const { name, phone } = bodyResult.data
	const count = await User.count({ where: { id: { [Op.ne]: userId }, name } })

	// --- If exists, name is taken
	if (count != 0) {
        throw createError({
			statusCode: 400,
			statusMessage: "User name taken.",
		})
	}

	// --- Find the user
	const user = await User.findByPk(userId)

	// --- User doesn't exists
	if (!user) {
		throw createError({
			statusCode: 404,
			statusMessage: "User not found.",
		})
	}

    // --- Udpate the user and provide it
	await user.update({ name, phone })
	return UserSafeSchema.parse(user)
})