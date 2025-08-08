import { User } from "~~/server/models/user"

//

/**
 * This redirects user to user page when accessing
 * auth page with access token, they must sign-out first.
 */
export default defineEventHandler(async (event) => {
	// Note: If this is user route, access and refresh token will surely exists.
	const {
		isApi,
		isAuthPage,
		isSignOutPage,
		accessToken,
		accessTokenPayload,
	} = event.context

	// --- Auth pages like /auth/sign-in shouldn't be accessed while signed-in except sign-out
	if (!isAuthPage || !accessToken || isSignOutPage) return

	// --- Do not allow auth requests while signed-in to avoid anomaly
	if (isApi) {
		throw createError({
			statusCode: 400,
			statusMessage: "User must sign-out before accessing auth pages.",
		})
	}

	// --- Determine who is signed-in
	const id = accessTokenPayload.id as number
	const user = await User.findByPk(id, { attributes: ["name"] })

	// --- Rare case: dev anomaly
	if (!user) {
		deleteCookie(event, "access-token")
		return deleteCookie(event, "refresh-token")
	}

	// --- Redirect to user page
	return sendRedirect(event, `/user/${user.name}/greenhouse`)
})
