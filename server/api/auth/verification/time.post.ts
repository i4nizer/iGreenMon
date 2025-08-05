import { UserEmailSchema } from "~~/shared/schema/user"
import { getNextResendTime } from "~~/server/services/auth/verification"

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
	const getTimeResult = await getNextResendTime(bodyResult.data.email)
	if (!getTimeResult.success) {
		throw createError({
			statusCode: 400,
			message: getTimeResult.error,
		})
	}

	// --- Send the allowed next resend time
	return { nextResendTime: getTimeResult.data.nextResendTime }
})
