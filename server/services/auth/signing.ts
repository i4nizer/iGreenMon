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
			return { success: false, error }
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
		const query = `?token=${token.value}`
		const path = `/auth/verification/email/${user.email}/verify`
		const verificationLink = `${origin}${path}${query}`

		// --- Render the email with the user and link
		const emailTemplate = await renderTemplate({
			type: "Verification",
			data: { name: user.name, link: verificationLink },
		})

		// --- Send the email
		queueEmail(
			user.email,
			"Account Verification - Greenmon",
			undefined,
			emailTemplate
		)

		// --- Return the signing user
		return { success: true, data: signingUser }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Finds the user by name.
 * - Checks if the user is not disabled.
 * - Checks if the user is verified.
 * - Matches the password provided.
 * - Creates or updates existing refresh token in database.
 * - Emails user on either successful or failed sign-in attempt.
 */
const signIn = async (
	name: string,
	password: string
): Promise<SafeResult<{ accessToken: string; refreshToken: string }>> => {
	try {
		// --- Find user
		const user = await User.findOne({ where: { name } })
		if (!user) return { success: false, error: "User not registered." }

		// --- Dev/Admin can block user
		if (user.disabled) return { success: false, error: "User is blocked." }

		// --- Must be verified first
		if (!user.verified) {
			return { success: false, error: "User is not yet verified." }
		}

		// --- Compare password
		const match = await bcrypt.compare(password, user.password)

		// --- Failed attempt
		if (!match) {
			// --- Craft failed attempt template
			const failedTemplate = await renderTemplate({
				type: "Sign-In-Failed",
				data: { name: user.name, timestamp: new Date() }
			})
			
			// --- Email the user about the failed sign-in
			queueEmail(
				user.email,
				"Sign-In Attempt Failed - Greenmon",
				undefined,
				failedTemplate
			)
			
			return { success: false, error: "Incorrect password." }
		}

		// --- Create access and refresh tokens
		const payload = { id: user.id }
		const accessToken = createToken(payload, "Access")
		const refreshToken = createToken(payload, "Refresh")

		// --- Find existing refresh token of user
		const tokenCondition = { type: "Refresh", userId: user.id }
		const refreshTokenCount = await Token.count({ where: tokenCondition })

		// --- Save refresh token in the database
		if (refreshTokenCount <= 0) {
			await Token.create({
				type: "Refresh",
				value: refreshToken,
				userId: user.id,
			})
		}
		// --- Update existing refresh token
		else {
			await Token.update(
				{ type: "Refresh", value: refreshToken },
				{ where: { type: "Refresh", userId: user.id } }
			)
		}

		// --- Craft successful sign-in email
		const successTemplate = await renderTemplate({
			type: "Sign-In-Success",
			data: { name: user.name, timestamp: new Date() }
		})

		// --- Email user about the successful sign-in
		queueEmail(
			user.email,
			"Sign-In Successful - Greenmon",
			undefined,
			successTemplate
		)

		// --- Provide the tokens to be attached to client
		return {
			success: true,
			data: { accessToken, refreshToken },
		}
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

//

export { signUp, signIn }
