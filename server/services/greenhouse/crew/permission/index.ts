import type { PermissionGrant, PermissionRevoke } from "#shared/schema/permission"
import { Greenhouse } from "~~/server/models/greenhouse"
import { Permission } from "~~/server/models/permission"

//

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

export { grantPermission, revokePermission }