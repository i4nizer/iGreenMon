import { User } from "~~/server/models/user"
import { Token } from "~~/server/models/token"
import { queueEmail } from "~~/server/services/email"
import { createToken, safeVerifyToken } from "~~/server/services/token"
import bcrypt from "bcrypt"

//

/**
 * - Checks if any user with such email exists.
 * - Checks if the user is not yet verified.
 * - Checks if the user is blocked.
 */
const findVerifiedUser = async (email: string): Promise<SafeResult<User>> => {
	try {
		const user = await User.findOne({ where: { email } })

		// --- Email doesn't point to any user
		if (!user) return { success: false, error: "Email not registered." }

		// --- User isn't verified yet
		if (!user.verified) {
			return { success: false, error: "User is not yet verified." }
		}

		// --- User is blocked by Dev/Admin
		if (user.disabled) return { success: false, error: "User is blocked." }

		// --- Provide the user
		return { success: true, data: user }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Finds the user's reset token.
 * - Creates the token if doesn't exists.
 * - Creates new token if it is expired.
 */
const findOrCreateValidResetToken = async (
	userId: number
): Promise<SafeResult<{ token: Token, created: boolean }>> => {
	try {
		let token = await Token.findOne({ where: { type: "Reset", userId } })
		let created = false

		// --- User won't have reset token at first forgot
		if (!token) {
			const payload = { id: userId }
			const resetToken = createToken(payload, "Reset")

			created = true
			token = await Token.create({
				value: resetToken,
				type: "Reset",
				userId,
			})
		}

		// --- Token could be expired or invalid, either way system created it.
		const tokenResult = safeVerifyToken(token.value, "Reset")
		if (!tokenResult.success) {
			const payload = { id: userId }
			const resetToken = createToken(payload, "Reset")
			await token.update({ value: resetToken })
		}

		// --- Provide the valid verification token
		return { success: true, data: { token, created } }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Checks if any user with such email exists.
 * - Checks if the user is not yet verified.
 * - Checks if the user is blocked.
 * - Finds the user's reset token.
 * - Creates the token if doesn't exists.
 * - Creates new token if it is expired.
 * - Checks if the resend is still on cooldown.
 * - Sends the email with reset link.
 */
const forgotPassword = async (
	email: string,
	origin: string
): Promise<SafeResult<{ nextResendTime: number }>> => {
    try {
        // --- Find user of email
        const findUserResult = await findVerifiedUser(email)
        if (!findUserResult.success) {
            return { success: false, error: findUserResult.error }
        }

        // --- Find user's reset token
        const user = findUserResult.data
        const tokenResult = await findOrCreateValidResetToken(user.id)
        if (!tokenResult.success) {
            return { success: false, error: tokenResult.error }
        }

        // --- Token's updatedAt field represents last send
        const { token, created } = tokenResult.data
        const cooldown = 60000
        const validResendTime = token.updatedAt.getTime() + cooldown

        // --- Avoid spamming of email resend
        if (Date.now() < validResendTime && !created) {
			const msDiff = validResendTime - Date.now()
			const secDiff = (msDiff == 0 ? 0 : msDiff / 1000).toFixed(0)
			const error = `Please wait another ${secDiff}s before resending.`
			return { error, success: false }
		}
		// --- Marks the last resend through updatedAt
        else {
            token.changed("updatedAt", true)
            await token.update({ updatedAt: new Date() })
        }
        
        // --- Craft the forgot pass email link and template
        const pathMeta = `email/${user.email}/reset?token=${token.value}`
		const resetLink = `${origin}/auth/recovery/${pathMeta}`
		const resetTemplate = await renderTemplate({
			type: "Reset-Password",
			data: { name: user.name, link: resetLink },
        })
        
        // --- Send the email with reset link
        queueEmail(
            user.email,
            "Reset Your Password - Greenmon",
            undefined,
            resetTemplate
        )

        // --- Provide the next resend time
        return {
            success: true,
            data: { nextResendTime: token.updatedAt.getTime() + cooldown }
        }
    } catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Finds the user of the email.
 * - Finds the user's reset token.
 * - Calculates and returns the cooldown time.
 */
const getNextResetResendTime = async (
	email: string
): Promise<SafeResult<{ nextResendTime: number }>> => {
	try {
		// --- Find user of email
		const findUserResult = await findVerifiedUser(email)
		if (!findUserResult.success) {
			return { success: false, error: findUserResult.error }
		}

		// --- Find user's reset token
		const user = findUserResult.data
		const tokenQuery = { type: "Reset", userId: user.id }
		const token = await Token.findOne({ where: tokenQuery })
		if (!token) {
			return { success: false, error: "User is not resetting password." }
		}

		// --- Provide the next valid time
		const cooldown = 60000
		const nextResendTime = token.updatedAt.getTime() + cooldown
		return { success: true, data: { nextResendTime } }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Finds the user of the email.
 * - Finds the user's reset token.
 * - Checks the cooldown time.
 * - Sends the reset-password-email again.
 */
const resendResetPasswordEmail = async (
	email: string,
	origin: string
): Promise<SafeResult<{ nextResendTime: number }>> => {
	try {
		// --- Find user of email
		const findUserResult = await findVerifiedUser(email)
		if (!findUserResult.success) {
			return { success: false, error: findUserResult.error }
		}

		// --- Find user's reset token
		const user = findUserResult.data
		const tokenQuery = { type: "Reset", userId: user.id }
		const token = await Token.findOne({ where: tokenQuery })
		if (!token) {
			return { success: false, error: "User is not resetting password." }
		}

		// --- Check the cooldown
		const cooldown = 60000
		const validResendTime = token.updatedAt.getTime() + cooldown
		
		// --- To avoid getting spammed
		if (Date.now() < validResendTime) {
			const msDiff = validResendTime - Date.now()
			const secDiff = (msDiff == 0 ? 0 : msDiff / 1000).toFixed(0)
			const error = `Please wait another ${secDiff}s before resending.`
			return { success: false, error }
		}
		// --- Marks the last resend through updatedAt
		else {
			token.changed("updatedAt", true)
			await token.update({ updatedAt: new Date() })
		}

		// --- Craft the forgot pass email link and template
		const pathMeta = `email/${user.email}/reset?token=${token.value}`
		const resetLink = `${origin}/auth/recovery/${pathMeta}`
		const resetTemplate = await renderTemplate({
			type: "Reset-Password",
			data: { name: user.name, link: resetLink },
		})

		// --- Send the email with reset link
		queueEmail(
			user.email,
			"Reset Your Password - Greenmon",
			undefined,
			resetTemplate
		)

		// --- Provide the next valid time
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
 * - Verifies the provided token.
 * - Finds the user based on the token's payload.
 * - Matches the token in the database.
 * - Updates the user's password and deletes the reset token from database.
 * - Emails the user about the reset.
 */
const resetPassword = async(
	password: string,
	resetToken: string
): Promise<SafeResult<User>> => {
	try {
		// --- Validate the token
		const tokenResult = safeVerifyToken<{ id: number }>(resetToken, "Reset")
		if (!tokenResult.success) {
			return { success: false, error: "Invalid token provided." }
		}

		// --- Find user through the token
		const userId = tokenResult.data.id
		const user = await User.findOne({ where: { id: userId } })
		if (!user) {
			return { success: false, error: "Invalid token provided." }
		}

		// --- Find the token in the database
		const tokenQuery = { type: "Reset", value: resetToken, userId }
		const token = await Token.findOne({ where: tokenQuery })
		if (!token) {
			return { success: false, error: "Invalid token provided." }
		}

		// --- Update user's password and delete the token
		const hashedPassword = await bcrypt.hash(password, 10)
		await user.update({ password: hashedPassword })
		await token.destroy()

		// --- Inform user via email
		const emailTemplate = await renderTemplate({
			type: "Reset-Password-Success",
			data: { name: user.name }
		})

		// --- Send email
		queueEmail(
			user.email,
			"Password Changed - Greenmon",
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

export {
	forgotPassword,
	getNextResetResendTime,
	resendResetPasswordEmail,
	resetPassword,
}