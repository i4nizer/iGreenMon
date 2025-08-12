import { cancelInvitation } from "~~/server/services/invitation"

//

export default defineEventHandler(async (event) => {
    // --- Get invitation id from params
    const { invid } = getRouterParams(event, { decode: true })
    const invitationId = parseInt(invid)
    
    if (isNaN(invitationId)) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid invitation.",
        })
    }

    // --- Pass logic to inv service
    const userId = event.context.accessTokenPayload.id
    const acceptResult = await cancelInvitation(invitationId, userId)

    if (!acceptResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: acceptResult.error,
        })
    }

    // --- Return the invitation
    return acceptResult.data.dataValues
})