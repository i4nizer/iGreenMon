import { signUp } from "~~/server/services/auth"
import { UserSignUpSchema } from "~~/shared/schema/user"

//

export default defineEventHandler(async (event) => {
	// --- Validation
	const body = await readBody(event)
	const bodyResult = UserSignUpSchema.safeParse(body)
	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: bodyResult.error.message,
		})
	}

	// --- Pass signing up to auth service
	const origin = `${getRequestProtocol(event)}://${getRequestHost(event)}`
	const signUpResult = await signUp(bodyResult.data, origin)
	if (!signUpResult.success) {
		console.log(signUpResult.error)
		throw createError({
			statusCode: 400,
			statusMessage: signUpResult.error,
		})
	}

	// --- Redirect to display email sent
	const user = signUpResult.data.dataValues
	return { redirectUrl: `/auth/verification/email/${user.email}/sent` }
})
