import { z } from "zod"
import { UserSchema } from "~~/shared/schema/user"
import { verifyUser } from "~~/server/services/auth/verification"

//

const VerificationSchema = UserSchema
	.pick({ email: true })
	.merge(z.object({ token: z.string().jwt() }))

//

export default defineEventHandler(async (event) => {
	// --- Validation
	const body = await readBody(event)
	const bodyResult = VerificationSchema.safeParse(body)
	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: bodyResult.error.message,
		})
	}

	// --- Pass verification to auth service
	const { email, token } = bodyResult.data
	const verificationResult = await verifyUser(email, token)
	if (!verificationResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: verificationResult.error,
		})
	}

	// --- Redirect to Sign In
	const user = verificationResult.data
	return { redirectUrl: `/auth/sign-in?name=${user.name}` }
})
