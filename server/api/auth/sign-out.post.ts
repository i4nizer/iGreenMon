import { Token } from "~~/server/models/token"

//

export default defineEventHandler(async (event) => {
    // --- Get user from token
    const id = event.context.accessTokenPayload.id

    // --- Remove tokens
    deleteCookie(event, "access-token")
    deleteCookie(event, "refresh-token")

    // --- Remove refresh token from database too
    await Token.destroy({ where: { type: "Refresh", userId: id } })

    // --- Nothing
    return sendNoContent(event)
})