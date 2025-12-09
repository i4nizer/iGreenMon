import { safeVerifyToken } from "~~/server/services/token"

//

/**
 * This middleware verifies refresh token.
 *  - if valid, it and its payload is attached to the context
 *  - else, it is removed from cookies
 */
export default defineEventHandler(async (event) => {
    // --- Get valid refresh token
    const refreshToken = getCookie(event, "refresh-token")
    if (!refreshToken) return;
    
    // --- Verify refresh token
    const verifyResult = safeVerifyToken(refreshToken, "Refresh")
    if (!verifyResult.success) return deleteCookie(event, "refresh-token")

    // --- Attach token and payload to event context
    event.context.refreshToken = refreshToken
    event.context.refreshTokenPayload = verifyResult.data
})