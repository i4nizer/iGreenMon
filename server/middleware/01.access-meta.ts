import { safeVerifyToken } from "~~/server/services/token"

//

/**
 * This middleware verifies access token.
 *  - if valid, it and its payload is attached to the context
 *  - else, it is removed from cookies
 */
export default defineEventHandler(async (event) => {
    // --- Skip non-user page requests
    if (!event.context.isUserPage) return;

    // --- Get valid access token
    const accessToken = getCookie(event, "access-token")
    if (!accessToken) return;
    
    // --- Verify access token
    const verifyResult = safeVerifyToken<{ id: number }>(accessToken, "Access")
    if (!verifyResult.success) return deleteCookie(event, "access-token")

    // --- Attach token and payload to event context
    event.context.accessToken = accessToken
    event.context.accessTokenPayload = verifyResult.data
})