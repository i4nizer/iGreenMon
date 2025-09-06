import { Input } from "~~/server/models/input";
import { InputCreate, InputUpdate } from "~~/shared/schema/input";
import { hasInputPermission } from "./util";
import esp32 from "~~/server/services/esp32";

//

/**
 * - Checks Input:Create permission.
 * - Creates the input.
 */
const createInput = async (
    data: InputCreate,
    userId: number
): Promise<SafeResult<Input>> => {
    try {
        // --- Check permission
        const permResult = await hasInputPermission(
            "Create",
            data.actuatorId,
            userId
        )

        if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
        }
        
        // --- Create and return the input
        const input = await Input.create({ ...data })
        return { success: true, data: input }
    } catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Checks Input:Retrieve permission.
 * - Retrieves the input.
 */
const retrieveInput = async (
    id: number,
    userId: number
): Promise<SafeResult<Input>> => {
    try {
		// --- Find input
		const input = await Input.findByPk(id)
		if (!input) return { success: false, error: "Input not found." }

		// --- Check permission
		const permResult = await hasInputPermission(
			"Retrieve",
			input.actuatorId,
			userId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
        }
        
        // --- return input
        return { success: true, data: input }
	} catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Checks Input:Update permission.
 * - Updates the input.
 */
const updateInput = async (
    data: InputUpdate,
    userId: number
): Promise<SafeResult<Input>> => {
    try {
		// --- Find input
		const input = await Input.findByPk(data.id)
		if (!input) return { success: false, error: "Input not found." }

		// --- Check permission
		const permResult = await hasInputPermission(
			"Update",
			input.actuatorId,
			userId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}
		
		// --- Save changed stat
		const changed = data.flag != input.flag
        
        // --- Update and return input
        const { name, icon, type, flag, pinId } = data
        await input.update({ name, icon, type, flag, pinId })
		
		// --- Update websocket too
		if (changed) await esp32.input.update(data)
        return { success: true, data: input }
	} catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Checks Input:Delete permission.
 * - Deletes the input.
 */
const deleteInput = async (id: number, userId: number): Promise<SafeResult> => {
    try {
        // --- Find input
        const input = await Input.findOne({
            where: { id },
            attributes: ["id", "actuatorId"],
        })
		if (!input) return { success: false, error: "Input not found." }

		// --- Check permission
		const permResult = await hasInputPermission(
			"Update",
			input.actuatorId,
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
        await input.destroy()
        return { success: true, data: undefined }
    } catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

//

export { createInput, retrieveInput, updateInput, deleteInput }