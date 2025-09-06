import { Hook } from "~~/server/models/hook";
import { HookCreate, HookUpdate } from "~~/shared/schema/hook";
import { hasHookPermission } from "./util";
import esp32 from "~~/server/services/esp32";

//

/**
 * - Checks Hook:Create permission.
 * - Creates the hook.
 */
const createHook = async (
    data: HookCreate,
    userId: number
): Promise<SafeResult<Hook>> => {
    try {
        // --- Check permission
        const permResult = await hasHookPermission(
            "Create",
            data.sensorId,
            userId
        )

        if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
        }
        
        // --- Create and return the hook
		const hook = await Hook.create({ ...data })
		
		// --- Send to websocket
		esp32.api.hook.create(hook)

        return { success: true, data: hook }
    } catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Checks Hook:Retrieve permission.
 * - Retrieves the hook.
 */
const retrieveHook = async (
    id: number,
    userId: number
): Promise<SafeResult<Hook>> => {
    try {
		// --- Find hook
		const hook = await Hook.findByPk(id)
		if (!hook) return { success: false, error: "Hook not found." }

		// --- Check permission
		const permResult = await hasHookPermission(
			"Retrieve",
			hook.sensorId,
			userId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
        }
        
        // --- return hook
        return { success: true, data: hook }
	} catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Checks Hook:Update permission.
 * - Updates the hook.
 */
const updateHook = async (
    data: HookUpdate,
    userId: number
): Promise<SafeResult<Hook>> => {
    try {
		// --- Find hook
		const hook = await Hook.findByPk(data.id)
		if (!hook) return { success: false, error: "Hook not found." }

		// --- Check permission
		const permResult = await hasHookPermission(
			"Update",
			hook.sensorId,
			userId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// --- Update and return hook
		const { type, actionId } = data
		await hook.update({ type, actionId })

		// --- Send to websocket
		esp32.api.hook.update(hook)

		return { success: true, data: hook }
	} catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Checks Hook:Delete permission.
 * - Deletes the hook.
 */
const deleteHook = async (id: number, userId: number): Promise<SafeResult> => {
    try {
		// --- Find hook
		const hook = await Hook.findOne({
			where: { id },
			attributes: ["id", "sensorId"],
		})
		if (!hook) return { success: false, error: "Hook not found." }

		// --- Check permission
		const permResult = await hasHookPermission(
			"Update",
			hook.sensorId,
			userId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// --- delete and return
		await hook.destroy()

		// --- Send to websocket
		esp32.api.hook.destroy(hook)

		return { success: true, data: undefined }
	} catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

//

export { createHook, retrieveHook, updateHook, deleteHook }