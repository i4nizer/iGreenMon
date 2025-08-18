import { InferAttributes } from "sequelize"
import { Crew } from "~~/server/models/crew"
import { Greenhouse } from "~~/server/models/greenhouse"
import { Invitation } from "~~/server/models/invitation"
import { User } from "~~/server/models/user"
import { queueEmail } from "~~/server/services/email"
import { InvitationCreate } from "~~/shared/schema/invitation"

//

/**
 * - Prevents creating another invitation while there is still existing valid one.
 */
const createInvitation = async (
	data: InvitationCreate,
	inviterId: number
): Promise<SafeResult<Invitation>> => {
	try {
		// --- Check if already a crew
		const crewCount = await Crew.count({
			where: {
				userId: data.inviteeId,
				greenhouseId: data.greenhouseId,
			},
		})

		if (crewCount > 0) {
			return {
				success: false,
				error: "User is already a crew of the greenhouse.",
			}
		}

		// --- Check if there is valid existing in invitation for the same greenhouse
		const invCount = await Invitation.count({
			where: {
				response: "Unset",
				inviterId,
				inviteeId: data.inviteeId,
				greenhouseId: data.greenhouseId,
			},
		})

		// --- Already invited
		if (invCount > 0) {
			return { success: false, error: "User is already invited." }
		}

		// --- Create and return the invitation
		const inv = await Invitation.create({ ...data, inviterId })

		// --- Get invitee name
		const invitee = await User.findOne({
			where: { id: data.inviteeId },
			attributes: ["name", "email"],
		})
		if (!invitee) return { success: false, error: "Invitee not found." }

		// --- Get inviter name
		const inviter = await User.findOne({
			where: { id: inviterId },
			attributes: ["name"],
		})
		if (!inviter) return { success: false, error: "Inviter not found." }

		// --- Get greenhouse
		const gh = await Greenhouse.findOne({
			where: { id: data.greenhouseId },
			attributes: ["name"],
		})
		if (!gh) return { success: false, error: "Greenhouse not found." }

		// --- Craft invitation email
		const template = await useTemplate({
			type: "Invitation",
			data: {
				invitee: invitee.name,
				inviter: inviter.name,
				message: data.message,
				greenhouse: gh.name,
			},
		})

		// --- Send email
		queueEmail(
			invitee.email,
			"Crew Invitation - Greenmon",
			undefined,
			template
		)

		return { success: true, data: inv }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Finds and validates the invitation.
 * - Ensures the inviter owns it.
 */
const cancelInvitation = async (
	invId: number,
	inviterId: number
): Promise<SafeResult<Invitation>> => {
	try {
		// --- Find valid invitation of the inviter
		const inv = await Invitation.findOne({
			where: {
				id: invId,
				response: "Unset",
				inviterId,
			},
			include: [
				{
					model: User,
					as: "invitee",
					required: true,
					foreignKey: "inviteeId",
					attributes: ["name", "email"],
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

		// --- The inviter either doesn't own the invitation or done
		if (!inv) return { success: false, error: "Invitation not found." }
		
		// --- Cancel the invitation
		await inv.update({ response: "Cancelled" })
		const invitation = inv.dataValues as InferAttributes<Invitation> & {
			invitee: { name: string; email: string }
			inviter: { name: string }
			greenhouse: { name: string }
		}

		// --- Inform the invitee about the cancellation
		const template = await useTemplate({
			type: "Invitation-Cancelled",
			data: {
				invitee: invitation.invitee.name,
				inviter: invitation.inviter.name,
				greenhouse: invitation.greenhouse.name,
			},
		})

		// --- Send the email
		queueEmail(
			invitation.invitee.email,
			"Invitation Cancelled - Greenmon",
			undefined,
			template
		)

		return { success: true, data: inv }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Finds and validates the invitation.
 * - Ensures the invitee is the one invited.
 */
const acceptInvitation = async (
	invId: number,
	inviteeId: number
): Promise<SafeResult<Invitation>> => {
	try {
		// --- Find valid invitation of the invitee
		const inv = await Invitation.findOne({
			where: {
				id: invId,
				response: "Unset",
				inviteeId,
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
					attributes: ["name", "email"],
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

		// --- The invitee either wasn't invited or done
		if (!inv) return { success: false, error: "Invitation not found." }

		// --- Accept the invitation
		await inv.update({ response: "Accepted" })
		const invitation = inv.dataValues as InferAttributes<Invitation> & {
			invitee: { name: string }
			inviter: { name: string; email: string }
			greenhouse: { name: string }
		}

		// --- Create crew with the userId
		await Crew.create({
			userId: inv.inviteeId,
			greenhouseId: inv.greenhouseId,
		})

		// --- Inform the inviter about the acceptance
		const template = await useTemplate({
			type: "Invitation-Accepted",
			data: {
				invitee: invitation.invitee.name,
				inviter: invitation.inviter.name,
				greenhouse: invitation.greenhouse.name,
			},
		})

		// --- Send the email
		queueEmail(
			invitation.inviter.email,
			"Invitation Accepted - Greenmon",
			undefined,
			template
		)

		return { success: true, data: inv }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Finds and validates the invitation.
 * - Ensures the invitee is the one invited.
 */
const rejectInvitation = async (
	invId: number,
	inviteeId: number
): Promise<SafeResult<Invitation>> => {
	try {
		// --- Find valid invitation of the invitee
		const inv = await Invitation.findOne({
			where: {
				id: invId,
				response: "Unset",
				inviteeId,
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
					attributes: ["name", "email"],
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

		// --- The invitee either wasn't invited or done
		if (!inv) return { success: false, error: "Invitation not found." }

		// --- Reject the invitation
		await inv.update({ response: "Rejected" })
		const invitation = inv.dataValues as InferAttributes<Invitation> & {
			invitee: { name: string }
			inviter: { name: string; email: string }
			greenhouse: { name: string }
		}

		// --- Inform the inviter about the rejection
		const template = await useTemplate({
			type: "Invitation-Declined",
			data: {
				invitee: invitation.invitee.name,
				inviter: invitation.inviter.name,
				greenhouse: invitation.greenhouse.name,
			},
		})

		// --- Send the email
		queueEmail(
			invitation.inviter.email,
			"Invitation Declined - Greenmon",
			undefined,
			template
		)

		return { success: true, data: inv }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

//

export {
	createInvitation,
	cancelInvitation,
	acceptInvitation,
	rejectInvitation,
}
