import { Op } from "sequelize"
import { Greenhouse } from "~~/server/models/greenhouse"
import { Invitation } from "~~/server/models/invitation"
import { User } from "~~/server/models/user"

//

export default defineEventHandler(async (event) => {
    // --- Get invitation id from params
    const { invid } = getRouterParams(event, { decode: true })
    const userId = event.context.accessTokenPayload.id

    // --- Find with joins
    const invitation = await Invitation.findOne({
        where: {
            id: invid,
            [Op.or]: [
                { inviteeId: userId },
                { inviterId: userId },
            ],
        },
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
    })

    if (!invitation) {
        throw createError({
            statusCode: 404,
            statusMessage: "Invitation not found.",
        })
    }
    
    return invitation.dataValues as InvitationGet
})