import { ActionCreate, ActionUpdate } from "#shared/schema/action"
import { Action } from "~~/server/models/action"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"

//

/**
 * - Checks for Action:Create permission.
 * - Creates action and token.
 */
const createAction = async (
	data: ActionCreate,
	userId: number
): Promise<SafeResult<Action>> => {
	try {
		// --- Check for permission
		const permResult = await hasPermission(
			"Create",
			"Action",
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

		// --- Create and return the action
		const action = await Action.create({ ...data })
		return { success: true, data: action }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Checks for Action:Retrive permission.
 * - Finds the action.
 */
const retrieveAction = async (
	id: number,
	userId: number
): Promise<SafeResult<Action>> => {
	try {
		// --- Find action
		const action = await Action.findByPk(id)
		if (!action) return { success: false, error: "Action not found." }

		// --- Check for permission
		const permResult = await hasPermission(
			"Retrieve",
			"Action",
			userId,
			action.greenhouseId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// --- passed, return it
		return { success: true, data: action }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Checks Action:Update permission.
 * - Updates the action.
 */
const updateAction = async (
	data: ActionUpdate,
	userId: number
): Promise<SafeResult<Action>> => {
	try {
		// --- Find action
		const action = await Action.findByPk(data.id)
		if (!action) return { success: false, error: "Action not found." }

		// --- Check for permission
		const permResult = await hasPermission(
			"Update",
			"Action",
			userId,
			action.greenhouseId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// passed, update and return it
		await action.update(data)
		return { success: true, data: action }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Checks Action:Delete permission.
 * - Deletes action.
 */
const deleteAction = async (id: number, userId: number): Promise<SafeResult> => {
	try {
		// --- Find action
		const action = await Action.findOne({
			where: { id },
			attributes: ["id", "greenhouseId"],
		})
		if (!action) return { success: false, error: "Action not found." }

		// --- Check for permission
		const permResult = await hasPermission(
			"Delete",
			"Action",
			userId,
			action.greenhouseId
		)
		
		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// --- passed, delete it
		await action.destroy()
		return { success: true, data: undefined }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

//

export { createAction, retrieveAction, updateAction, deleteAction }
