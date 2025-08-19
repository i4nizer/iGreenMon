import type { PermissionGrant, PermissionResource, PermissionRevoke, PermissionType } from "#shared/schema/permission"
import { Crew } from "~~/server/models/crew"
import { Greenhouse } from "~~/server/models/greenhouse"
import { Permission } from "~~/server/models/permission"

//

const hasPermission = async (
	type: PermissionType,
	resource: PermissionResource,
	userId: number,
	greenhouseId: number
): Promise<SafeResult<boolean>> => {
	try {
		// --- Find the greenhouse
		const gh = await Greenhouse.findOne({
			where: { id: greenhouseId },
			attributes: ["id", "userId"],
		})
		if (!gh) return { success: false, error: "Greenhouse not found." }

		// --- Doesn't own it
		if (gh.userId != userId) {

			// --- Find user's crew instance on the greenhouse
			const crew = await Crew.findOne({
				where: { userId, greenhouseId },
				attributes: ["id"],
			})
			if (!crew) return { success: false, error: "Greenhouse not found." }

			// --- Check for permission
			const perm = await Permission.findOne({
				where: {
					type,
					resource,
					crewId: crew.id,
					greenhouseId,
				},
				attributes: ["id"],
			})

			// --- Doesn't have permission either
			if (!perm) return { success: true, data: false }
		}

		// --- Owner/permitted-crew of the greenhouse
		return { success: true, data: true }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Checks if the permission is already granted.
 * - Ensures granter is the owner.
 */
const grantPermission = async (
	data: PermissionGrant,
	granterId: number
): Promise<SafeResult<Permission>> => {
	try {
		// --- Check existing permission
		const permCount = await Permission.count({ where: { ...data } })

		// --- Already granted
		if (permCount > 0) {
			return { success: false, error: "Permission already granted." }
		}

		// --- Find the greenhouse and check if granter is the owner
		const gh = await Greenhouse.findOne({
			where: { id: data.greenhouseId },
			attributes: ["userId"],
		})

		// --- Granter isn't the owner
		if (!gh) return { success: false, error: "Greenhouse not found." }
		if (gh.userId != granterId) {
			return {
				success: false,
				error: "Only the owner can grant permissions.",
			}
		}

		// --- Create and return the permission
		const perm = await Permission.create({ ...data })
		return { success: true, data: perm }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Checks if the permission exists.
 * - Ensures revoker is the owner.
 */
const revokePermission = async (
	data: PermissionRevoke,
	revokerId: number
): Promise<SafeResult> => {
	try {
		// --- Find permssion first
		const perm = await Permission.findOne({ where: { ...data } })

		// --- Permission doesn't exist
        if (!perm) return { success: false, error: "Permission isn't granted." }
        
        // --- Check first if the revoker is the owner
        const gh = await Greenhouse.findOne({
			where: { id: data.greenhouseId },
			attributes: ["userId"],
		})

		// --- Granter isn't the owner
		if (!gh) return { success: false, error: "Greenhouse not found." }
		if (gh.userId != revokerId) {
			return {
				success: false,
				error: "Only the owner can revoke permissions.",
			}
        }
        
        // --- Remove permssion
        await perm.destroy()
        return { success: true, data: undefined }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

//

export { hasPermission, grantPermission, revokePermission }