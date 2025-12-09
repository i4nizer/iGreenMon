import { Token } from "~~/server/models/token"
import { createToken } from "~~/server/services/token"

//

/**
 * Skipped if route is doesn't require auth.
 *
 * If the access token is invalid/expired.
 *  - if it is, new access and refresh token is issued
 *  - refresh token in database is updated
 * If the refresh token is invalid/expired.
 *  - error is thrown for api, else redirect to sign-in
 */
export default defineEventHandler(async (event) => {
	// Note: Tokens are not attached if verification failed
	const {
		isApi,
		isUserPage,
		accessToken,
		refreshToken,
		refreshTokenPayload,
	} = event.context

	// --- Access config
	const config = useRuntimeConfig(event)
	const isProd = config.nodeEnv === "production"

	// ### Rotate - when no access token but has refresh
	if (!accessToken && refreshToken) {
		const id = refreshTokenPayload.id as number

		// --- Find refresh token first
		const tokenQuery = { type: "Refresh", userId: id }
		const token = await Token.findOne({ where: tokenQuery })

		// --- Invalid refresh token
		if (!token) {
			if (isApi) throw createError({ statusCode: 401 })
			else return sendRedirect(event, "/auth/sign-in")
		}

		// --- Issue new access token
		const newAccessToken = createToken({ id }, "Access")
		setCookie(event, "access-token", newAccessToken, {
			httpOnly: false,
			secure: isProd,
			sameSite: "strict",
			path: "/",
			maxAge: config.jwtAccessLife,
		})

		// --- Issue new refresh token
		const newRefreshToken = createToken({ id }, "Refresh")
		await token.update({ value: newRefreshToken })
		setCookie(event, "refresh-token", newRefreshToken, {
			httpOnly: true,
			secure: isProd,
			sameSite: "strict",
			path: "/",
			maxAge: config.jwtRefreshLife,
		})

		// --- Attach new tokens to event context
		event.context.accessToken = newAccessToken
		event.context.accessTokenPayload = { id }
		event.context.refreshToken = newRefreshToken
		event.context.refreshTokenPayload = { id }
	}

	// ### Unauthorized - when both tokens are missing
	if (!accessToken && !refreshToken && isUserPage) {
		if (isApi) throw createError({ statusCode: 401 })
		else return sendRedirect(event, "/auth/sign-in")
	}
})
