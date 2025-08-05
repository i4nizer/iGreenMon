import { UserEmailSchema } from "~~/shared/schema/user"
import { resendVerificationEmail } from "~~/server/services/auth/verification"

//

export default defineEventHandler(async (event) => {
	// --- Validation
	const body = await readBody(event)
	const bodyResult = UserEmailSchema.safeParse(body)

	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			message: bodyResult.error.message,
		})
	}

	// --- Pass the logic to auth service
	const { email } = bodyResult.data
	const origin = `${getRequestProtocol(event)}://${getRequestHost(event)}`
	const resendResult = await resendVerificationEmail(email, origin)

	if (!resendResult.success) {
		throw createError({
			statusCode: 400,
			message: resendResult.error,
		})
	}

	// --- Send the allowed next resend time
	return { nextResendTime: resendResult.data.nextResendTime }
})
