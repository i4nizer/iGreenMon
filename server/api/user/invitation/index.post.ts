import { createInvitation } from "~~/server/services/invitation"
import { InvitationCreateSchema } from "~~/shared/schema/invitation"

//

export default defineEventHandler(async (event) => {
    // --- Validate body
    const body = await readBody(event)
    const bodyResult = InvitationCreateSchema.safeParse(body)
    
    if (!bodyResult.success) {
        throw createError({
            statusCode: 400, 
            statusMessage: bodyResult.error.message,
        })
    }

    // --- Pass logic to the inv service
    const userId = event.context.accessTokenPayload.id
    const invResult = await createInvitation(bodyResult.data, userId)
    
    if (!invResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: invResult.error,
        })
    }

    // --- Return the invitation
    return invResult.data.dataValues
})