import { resetPassword } from "~~/server/services/auth"
import { UserPasswordResetSchema } from "~~/shared/schema/user"

//

export default defineEventHandler(async (event) => {
    // --- Validation
    const body = await readBody(event)
	const bodyResult = UserPasswordResetSchema.safeParse(body)
    if (!bodyResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: bodyResult.error.message,
        })
    }

    // --- Pass the reset logic to auth service
    const { password, token } = bodyResult.data
    const resetResult = await resetPassword(password, token)
    if (!resetResult.success) {
        throw createError({
			statusCode: 400,
			statusMessage: resetResult.error,
		})
    }

    // --- Send the redirect url
    const user = resetResult.data
    return { redirectUrl: `/auth/recovery/email/${user.email}/changed` }
})
