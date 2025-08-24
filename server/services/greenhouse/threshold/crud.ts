import { ThresholdCreate, ThresholdUpdate } from "#shared/schema/threshold"
import { Threshold } from "~~/server/models/threshold"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"

//

/**
 * - Checks for Threshold:Create permission.
 * - Creates threshold and token.
 */
const createThreshold = async (
	data: ThresholdCreate,
	userId: number
): Promise<SafeResult<Threshold>> => {
	try {
		// --- Check for permission
		const permResult = await hasPermission(
			"Create",
			"Threshold",
			userId,
			data.greenhouseId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// --- Create and return the threshold
		const threshold = await Threshold.create({ ...data })
		return { success: true, data: threshold }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Checks for Threshold:Retrive permission.
 * - Finds the threshold.
 */
const retrieveThreshold = async (
	id: number,
	userId: number
): Promise<SafeResult<Threshold>> => {
	try {
		// --- Find threshold
		const threshold = await Threshold.findByPk(id)
		if (!threshold) return { success: false, error: "Threshold not found." }

		// --- Check for permission
		const permResult = await hasPermission(
			"Retrieve",
			"Threshold",
			userId,
			threshold.greenhouseId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// --- passed, return it
		return { success: true, data: threshold }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Checks Threshold:Update permission.
 * - Updates the threshold.
 */
const updateThreshold = async (
	data: ThresholdUpdate,
	userId: number
): Promise<SafeResult<Threshold>> => {
	try {
		// --- Find threshold
		const threshold = await Threshold.findByPk(data.id)
		if (!threshold) return { success: false, error: "Threshold not found." }

		// --- Check for permission
		const permResult = await hasPermission(
			"Update",
			"Threshold",
			userId,
			threshold.greenhouseId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// passed, update and return it
		const { name, operator, disabled } = data
		await threshold.update({ name, operator, disabled })
		return { success: true, data: threshold }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Checks Threshold:Delete permission.
 * - Deletes threshold.
 */
const deleteThreshold = async (id: number, userId: number): Promise<SafeResult> => {
	try {
		// --- Find threshold
		const threshold = await Threshold.findOne({
			where: { id },
			attributes: ["id", "greenhouseId"],
		})
		if (!threshold) return { success: false, error: "Threshold not found." }

		// --- Check for permission
		const permResult = await hasPermission(
			"Delete",
			"Threshold",
			userId,
			threshold.greenhouseId
		)
		
		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// --- passed, delete it
		await threshold.destroy()
		return { success: true, data: undefined }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

//

export { createThreshold, retrieveThreshold, updateThreshold, deleteThreshold }
