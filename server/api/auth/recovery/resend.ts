import { UserEmailSchema } from "~~/shared/schema/user"
import { resendResetPasswordEmail } from "~~/server/services/auth"

//

export default defineEventHandler(async (event) => {
	// --- Validation
	const body = await readBody(event)
	const bodyResult = UserEmailSchema.safeParse(body)
	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: bodyResult.error.message,
		})
	}

	// --- Pass the resend logic to auth service
	const { email } = bodyResult.data
	const origin = `${getRequestProtocol(event)}://${getRequestHost(event)}`
	const resendResult = await resendResetPasswordEmail(email, origin)
	if (!resendResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: resendResult.error,
		})
	}

	// --- Send the allowed next resend time
	return { nextResendTime: resendResult.data.nextResendTime }
})
