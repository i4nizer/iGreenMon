import { UserEmailSchema } from "~~/shared/schema/user"
import { getNextVerificationResendTime } from "~~/server/services/auth"

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

	// --- Pass the logic to auth service
	const { email } = bodyResult.data
	const getTimeResult = await getNextVerificationResendTime(email)
	if (!getTimeResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: getTimeResult.error,
		})
	}

	// --- Send the allowed next resend time
	return { nextResendTime: getTimeResult.data.nextResendTime }
})
