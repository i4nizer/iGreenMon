import { Greenhouse } from "~~/server/models/greenhouse"
import { Invitation } from "~~/server/models/invitation"
import { User } from "~~/server/models/user"
import { rejectInvitation } from "~~/server/services/invitation"

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
    const acceptResult = await rejectInvitation(invitationId, userId)

    if (!acceptResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: acceptResult.error,
        })
    }

    // --- Get the invitation with a join
    const invitation = await Invitation.findOne({
        where: { id: invid },
        include: [
            {
                model: User,
                as: "invitee",
                required: true,
                foreignKey: "inviteeId",
                attributes: ["name"],
            },
            {
                model: User,
                as: "inviter",
                required: true,
                foreignKey: "inviterId",
                attributes: ["name"],
            },
            {
                model: Greenhouse,
                as: "greenhouse",
                required: true,
                foreignKey: "greenhouseId",
                attributes: ["name"],
            },
        ],
    }) as Invitation

    // --- Return the invitation
    return invitation.dataValues as InvitationGet
})