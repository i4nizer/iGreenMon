import { Invitation } from "~~/server/models/invitation"

//

/**
 * - Prevents creating another invitation while there is still existing valid one.
 */
const createInvitation = async (
	data: InvitationCreate,
	inviterId: number
): Promise<SafeResult<Invitation>> => {
	try {
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
		})

		// --- The inviter either doesn't own the invitation or done
		if (!inv) return { success: false, error: "Invitation not found." }

		// --- Cancel and provide the invitation
		await inv.update({ response: "Cancelled" })
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
		})

		// --- The invitee either wasn't invited or done
		if (!inv) return { success: false, error: "Invitation not found." }

		// --- Accept the invitation and return it
		await inv.update({ response: "Accepted" })
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
		})

		// --- The invitee either wasn't invited or done
		if (!inv) return { success: false, error: "Invitation not found." }

		// --- Reject the invitation and return it
		await inv.update({ response: "Rejected" })
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
