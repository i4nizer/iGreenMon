import { Output } from "~~/server/models/output";
import { OutputCreate, OutputUpdate } from "~~/shared/schema/output";
import { hasOutputPermission } from "./util";
import esp32 from "~~/server/services/esp32";

//

/**
 * - Checks Output:Create permission.
 * - Creates the output.
 */
const createOutput = async (
    data: OutputCreate,
    userId: number
): Promise<SafeResult<Output>> => {
    try {
        // --- Check permission
        const permResult = await hasOutputPermission(
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
        
        // --- Create and return the output
		const output = await Output.create({ ...data })
		
		// --- Send to websocket
		esp32.api.output.create(output)

        return { success: true, data: output }
    } catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Checks Output:Retrieve permission.
 * - Retrieves the output.
 */
const retrieveOutput = async (
    id: number,
    userId: number
): Promise<SafeResult<Output>> => {
    try {
		// --- Find output
		const output = await Output.findByPk(id)
		if (!output) return { success: false, error: "Output not found." }

		// --- Check permission
		const permResult = await hasOutputPermission(
			"Retrieve",
			output.sensorId,
			userId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
        }
        
        // --- return output
        return { success: true, data: output }
	} catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Checks Output:Update permission.
 * - Updates the output.
 */
const updateOutput = async (
    data: OutputUpdate,
    userId: number
): Promise<SafeResult<Output>> => {
    try {
		// --- Find output
		const output = await Output.findByPk(data.id)
		if (!output) return { success: false, error: "Output not found." }

		// --- Check permission
		const permResult = await hasOutputPermission(
			"Update",
			output.sensorId,
			userId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// --- Update and return output
		const { name, icon, unit, pinId } = data
		await output.update({ name, icon, unit, pinId })

		// --- Send to websocket
		esp32.api.output.update(output)

		return { success: true, data: output }
	} catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Checks Output:Delete permission.
 * - Deletes the output.
 */
const deleteOutput = async (id: number, userId: number): Promise<SafeResult> => {
    try {
		// --- Find output
		const output = await Output.findOne({
			where: { id },
			attributes: ["id", "sensorId"],
		})
		if (!output) return { success: false, error: "Output not found." }

		// --- Check permission
		const permResult = await hasOutputPermission(
			"Update",
			output.sensorId,
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
		await output.destroy()

		// --- Send to websocket
		esp32.api.output.destroy(output)

		return { success: true, data: undefined }
	} catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

//

export { createOutput, retrieveOutput, updateOutput, deleteOutput }