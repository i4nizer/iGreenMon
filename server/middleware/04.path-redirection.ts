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
		isAuthCheckPage,
		accessToken,
		accessTokenPayload,
	} = event.context

	// --- Only handle auth page requests
	if (!isAuthPage) return

	// --- Auth page but no access token
	if (!accessToken) return
	
	// --- Has access token but wants to sign-out or check name/email
	if (accessToken && (isSignOutPage || isAuthCheckPage)) return

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
