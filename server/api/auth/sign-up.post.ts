import { signUp } from "~~/server/services/auth"
import { queueEmail } from "~~/server/services/email"
import { UserSignUpSchema } from "~~/shared/schema/user"

//

export default defineEventHandler(async (event) => {
	// --- Validation
	const body = await readBody(event)
	const bodyResult = UserSignUpSchema.safeParse(body)
	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			message: bodyResult.error.message,
		})
	}

	// --- Pass signing up to auth service
	const signUpResult = await signUp(bodyResult.data)
	if (!signUpResult.success) {
		throw createError({
			statusCode: 400,
			message: signUpResult.error,
		})
	}

	// --- Craft the link
	const { user, token } = signUpResult.data
	const baseUrl = `${getRequestProtocol(event)}://${getRequestHost(event)}`
	const query = `?email=${user.email}&token=${token}`
	const emailLink = `${baseUrl}/auth/verification/verify${query}`

	// --- Render the email with the user and link
	const emailTemplate = await renderTemplate("Verification", {
		name: user.name,
		link: emailLink,
	})

	// --- Send the email
	queueEmail(
		user.email,
		"Account Verification - Greenmon",
		undefined,
		emailTemplate
	)

	// --- Redirect to display email sent
	return { redirectUrl: `/auth/verification/sent?email=${user.email}` }
})
