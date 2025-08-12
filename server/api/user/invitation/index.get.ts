import { Op } from "sequelize"
import { Greenhouse } from "~~/server/models/greenhouse"
import { Invitation } from "~~/server/models/invitation"
import { User } from "~~/server/models/user"

//

export default defineEventHandler(async (event) => {
    // --- Find both inwards and outwards invitation
    const userId = event.context.accessTokenPayload.id
    const invitations = await Invitation.findAll({
        where: {
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

    return invitations.map((i) => i.dataValues) as InvitationGet[]
})