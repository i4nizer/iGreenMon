
//

/**
 * This middleware tells what the route requires or other metas.
 *  - isApi
 *  - isUserPage (requires auth)
 *  - isAuthPage (/auth or /api/auth)
 */
export default defineEventHandler(async (event) => {
	// --- Attach route metas
	const url = getRequestURL(event)
	const path = url.pathname
	const userPage = path.startsWith("/user") || path.startsWith("/api/user")
	const authPage = path.startsWith("/auth") || path.startsWith("/api/auth")

	event.context.isApi = path.startsWith("/api")
	event.context.isUserPage = userPage
	event.context.isAuthPage = authPage
})
