import { Greenhouse } from "~~/server/models/greenhouse"
import { Invitation } from "~~/server/models/invitation"
import { User } from "~~/server/models/user"
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

	// --- Get the invitation with a join
	const invitation = (await Invitation.findOne({
		where: { id: invResult.data.id },
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
	})) as Invitation

	// --- Return the invitation
	return invitation.dataValues as InvitationGet
})