import { signIn } from "~~/server/services/auth"
import { UserSignInSchema } from "~~/shared/schema/user"

//

export default defineEventHandler(async (event) => {
	// --- Validation
	const body = await readBody(event)
	const bodyResult = UserSignInSchema.safeParse(body)
	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: bodyResult.error.message,
		})
	}

	// --- Pass the sign-in logic to auth service
	const { name, password } = bodyResult.data
	const signInResult = await signIn(name, password)
	if (!signInResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: signInResult.error,
		})
	}

	// --- Config decides cookies' secure flag
	const config = useRuntimeConfig(event)
	const isProd = config.nodeEnv === "production"
	const { accessToken, refreshToken } = signInResult.data

	// --- server and client accessible
	setCookie(event, "access-token", accessToken, {
		httpOnly: false,
		secure: isProd,
		sameSite: "strict",
		path: "/",
		maxAge: config.jwtAccessLife,
	})

	// --- server only accessible
	setCookie(event, "refresh-token", refreshToken, {
		httpOnly: true,
		secure: isProd,
		sameSite: "strict",
		path: "/",
		maxAge: config.jwtRefreshLife,
	})

	// --- Tell to redirect to user landing page
	return { redirectUrl: `/user/${name}/greenhouse` }
})
