import { forgotPassword } from "~~/server/services/auth/recovery"
import { UserEmailSchema } from "~~/shared/schema/user"

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

    // --- Pass the forgot logic to auth service
    const { email } = bodyResult.data
    const origin = `${getRequestProtocol(event)}://${getRequestHost(event)}`
    const forgotResult = await forgotPassword(email, origin)
    if (!forgotResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: forgotResult.error,
        })
    }

	// --- Tell to redirect after sent
	return { redirectUrl: `/auth/recovery/email/${email}/sent` }
})
