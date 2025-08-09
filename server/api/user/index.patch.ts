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

	// --- Check for user with same name or same email
	const userId = event.context.accessTokenPayload.id
	const { name, email, phone } = bodyResult.data
	const sameUser = await User.findOne({
		where: {
			id: { [Op.ne]: userId },
			[Op.or]: [{ name }, { email }],
		},
		attributes: ["name", "email"],
	})

	// --- If exists, name or email is taken
	if (sameUser != null) {
		const isSameName = sameUser.name == name
		const nameError = "User name taken."
		const emailError = "User email already exists."
		const error = isSameName ? nameError : emailError
		throw createError({ statusCode: 400, statusMessage: error })
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
	await user.update({ name, email, phone })
	return UserSafeSchema.parse(user)
})