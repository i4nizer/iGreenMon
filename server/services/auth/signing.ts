import bcrypt from "bcrypt"
import { Op } from "sequelize"
import { Token } from "~~/server/models/token"
import { User } from "~~/server/models/user"
import { createToken } from "~~/server/services/token"
import { UserSafeSchema } from "~~/shared/schema/user"

//

/**
 * ##### NOTE: This doesn't send the email verification, hence returns the token.
 * - Checks if user doesn't have matching name or email.
 * - Hashes the user's password before saving.
 * - Creates the verification token.
 */
const signUp = async (
	user: UserSignUp
): Promise<SafeResult<{ user: UserSafe; token: string }>> => {
	try {
		// --- Find user with same name or email
		const sameUser = await User.findOne({
			where: {
				[Op.or]: [{ name: user.name }, { email: user.email }],
			},
		})

		// --- If exists, name or email is taken
		if (sameUser != null) {
			const isSameName = sameUser.name == user.name
			const nameError = "User name taken."
			const emailError = "User email already exists."
			const error = isSameName ? nameError : emailError
			return { data: undefined, error, success: false }
		}

		// --- Do not save raw password
		const passwordHash = await bcrypt.hash(user.password, 10)
		const signingUser = await User.create({
			...user,
			password: passwordHash,
		})

		// --- Only use the user's ID in token
		const payload = { id: signingUser.dataValues.id }
		const verificationToken = createToken(payload, "Verify")
		const token = await Token.create({
			value: verificationToken,
			type: "Verify",
			userId: signingUser.id,
		})

		// --- Provide the token for later use.
		const safeUser = UserSafeSchema.parse(signingUser.dataValues)
		return {
			data: { user: safeUser, token: verificationToken },
			error: undefined,
			success: true,
		}
	} catch (error) {
		console.error(error)
		return {
			data: undefined,
			error: "Something went wrong.",
			success: false,
		}
	}
}

//

export { signUp }