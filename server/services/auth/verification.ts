import { Token } from "~~/server/models/token"
import { User } from "~~/server/models/user"
import { queueEmail } from "~~/server/services/email"
import { createToken, safeVerifyToken } from "~~/server/services/token"

//

/**
 * - Checks if any user with such email exists.
 * - Checks if the user is already verified.
 * - Checks if the user is blocked.
 */
const findUnverifiedUser = async (email: string): Promise<SafeResult<User>> => {
	try {
		const user = await User.findOne({ where: { email } })

		// --- Email doesn't point to any user
		if (!user) return { success: false, error: "Email not registered." }

		// --- Verification already done
		if (user.verified) {
			return { success: false, error: "User already verified." }
		}

		// --- User is blocked somehow
		if (user.disabled) return { success: false, error: "User is blocked." }

		// --- Provide the user
		return { success: true, data: user }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Finds the user's verification token.
 * - Creates the token if doesn't exists.
 * - Creates new token if it is expired.
 */
const findOrCreateValidVerificationToken = async (
	userId: number
): Promise<SafeResult<Token>> => {
	try {
		let token = await Token.findOne({ where: { type: "Verify", userId } })

		// --- Edge case that unverified user doesn't have token
		if (!token) {
			const payload = { id: userId }
			const verifyToken = createToken(payload, "Verify")

			token = await Token.create({
				value: verifyToken,
				type: "Verify",
				userId,
			})
		}

		// --- Token could be expired or invalid, either way system created it.
		const tokenResult = safeVerifyToken(token.value, "Verify")
		if (!tokenResult.success) {
			const payload = { id: userId }
			const verifyToken = createToken(payload, "Verify")
			await token.update({ value: verifyToken })
		}

		// --- Provide the valid verification token
		return { success: true, data: token }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

//

/**
 * - Checks if any user with such email exists.
 * - Checks if the user is already verified.
 * - Finds the user's verification token.
 * - Creates the token if it doesn't exists.
 * - Creates new token if it is expired.
 */
const getNextResendTime = async (
	email: string
): Promise<SafeResult<{ nextResendTime: number }>> => {
	try {
		// --- Find the user of email
		const findUserResult = await findUnverifiedUser(email)
		if (!findUserResult.success) {
			return { success: false, error: findUserResult.error }
		}

		// --- This is unverified user
		const user = findUserResult.data

		// --- Find user's verification token
		const tokenResult = await findOrCreateValidVerificationToken(user.id)
		if (!tokenResult.success) {
			return { success: false, error: tokenResult.error }
		}

		// --- This is the valid user verification token
		const token = tokenResult.data

		// --- Provide the time for the next resend
		const cooldown = 60000
		return {
			success: true,
			data: { nextResendTime: token.updatedAt.getTime() + cooldown },
		}
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Checks if any user with such email exists.
 * - Checks if the user is already verified.
 * - Checks if the user is blocked.
 * - Find the user's verification token.
 * - Creates the token if it doesn't exists.
 * - Checks if the resend is still on cooldown.
 * - Creates new token if it is expired.
 * - Sends the email verification.
 */
const resendVerificationEmail = async (
	email: string,
	origin: string
): Promise<SafeResult<{ nextResendTime: number }>> => {
	try {
		// --- Find the user of email
		const findUserResult = await findUnverifiedUser(email)
		if (!findUserResult.success) {
			return { success: false, error: findUserResult.error }
		}

		// --- This is unverified user
		const user = findUserResult.data

		// --- Find user's verification token
		const tokenResult = await findOrCreateValidVerificationToken(user.id)
		if (!tokenResult.success) {
			return { success: false, error: tokenResult.error }
		}

		// --- This is the valid user verification token
		const token = tokenResult.data

		// --- Token's updatedAt field represents last send
		const cooldown = 60000
		const validResendTime = token.updatedAt.getTime() + 60000
		token.changed("updatedAt", true)

		// --- This will avoid spamming resend request
		if (Date.now() < validResendTime) {
			const msDiff = validResendTime - Date.now()
			const secDiff = (msDiff == 0 ? 0 : msDiff / 1000).toFixed(0)
			const error = `Please wait another ${secDiff}s before resending.`
			return { error, success: false }
		}
		// --- Marks the last resend through updatedAt
		else await token.update({ updatedAt: new Date() })

		// --- Craft email link and template
		const pathMeta = `email/${user.email}/verify?token=${token.value}`
		const verificationLink = `${origin}/auth/verification/${pathMeta}`
		const emailTemplate = await renderTemplate({
			type: "Verification",
			data: { name: user.name, link: verificationLink }
		})

		// --- Send email verification
		queueEmail(
			user.email,
			"Account Verification - Greenmon",
			undefined,
			emailTemplate
		)

		// --- Provide the time for the next resend
		return {
			success: true,
			data: { nextResendTime: token.updatedAt.getTime() + cooldown },
		}
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Checks if any user with such email exists.
 * - Checks if the user is already verified.
 * - Checks if the user is blocked.
 * - Verifies the token of type "Verify".
 * - Updates the user as verified and deletes the token.
 * - Sends email to inform user of successful verification.
 */
const verifyUser = async (
	email: string,
	token: string
): Promise<SafeResult<User>> => {
	try {
		// --- Find the corresponding user first
		const userResult = await findUnverifiedUser(email)
		if (!userResult.success) {
			return { success: false, error: userResult.error }
		}

		// --- Validate token
		const tokenResult = safeVerifyToken<{ id: number }>(token, "Verify")
		if (!tokenResult.success) {
			return { success: false, error: "Invalid verification token" }
		}

		// --- Find token in the database
		const userId = userResult.data.id
		const tokenWhere = { type: "Verify", value: token, userId }
		const verificationToken = await Token.findOne({ where: tokenWhere })
		if (!verificationToken) {
			return { success: false, error: "Invalid verification token" }
		}

		// --- Verify user and delete token
		const user = userResult.data
		await user.update({ verified: true })
		await verificationToken.destroy()

		// --- Inform user via email
		const emailTemplate = await renderTemplate({
			type: "Verification-Success",
			data: { name: user.name }
		})

		// --- Send email
		queueEmail(
			user.email,
			"Account Verified - Greenmon",
			undefined,
			emailTemplate
		)

		// --- Provide the user
		return { success: true, data: user }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

//

export { getNextResendTime, resendVerificationEmail, verifyUser }
