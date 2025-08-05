import bcrypt from "bcrypt"
import { Op } from "sequelize"
import { Token } from "~~/server/models/token"
import { User } from "~~/server/models/user"
import { queueEmail } from "~~/server/services/email"
import { createToken } from "~~/server/services/token"

//

/**
 * - Checks if user doesn't have matching name or email.
 * - Hashes the user's password before saving.
 * - Creates the verification token.
 * - Sends the verification link via email.
 */
const signUp = async (
	user: UserSignUp,
	origin: string
): Promise<SafeResult<User>> => {
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

		// --- Craft the verification link
		const query = `?email=${user.email}&token=${token}`
		const verificationLink = `${origin}/auth/verification/verify${query}`

		// --- Render the email with the user and link
		const emailTemplate = await renderTemplate("Verification", {
			name: user.name,
			link: verificationLink,
		})

		// --- Send the email
		queueEmail(
			user.email,
			"Account Verification - Greenmon",
			undefined,
			emailTemplate
		)

		// --- Return the signing user
		return { data: signingUser, error: undefined, success: true }
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
