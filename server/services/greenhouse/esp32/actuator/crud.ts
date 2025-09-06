import { Actuator } from "~~/server/models/actuator";
import { ActuatorCreate, ActuatorUpdate } from "~~/shared/schema/actuator";
import { hasActuatorPermission } from "./util";
import esp32 from "~~/server/services/esp32";

//

/**
 * - Checks Actuator:Create permission.
 * - Creates the actuator.
 */
const createActuator = async (
    data: ActuatorCreate,
    userId: number
): Promise<SafeResult<Actuator>> => {
    try {
        // --- Check permission
        const permResult = await hasActuatorPermission(
            "Create",
            data.esp32Id,
            userId
        )

        if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
        }
        
        // --- Create and return the actuator
		const actuator = await Actuator.create({ ...data })
		
		// --- Send to websocket too
		esp32.api.actuator.create(actuator)

        return { success: true, data: actuator }
    } catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Checks Actuator:Retrieve permission.
 * - Retrieves the actuator.
 */
const retrieveActuator = async (
    id: number,
    userId: number
): Promise<SafeResult<Actuator>> => {
    try {
		// --- Find actuator
		const actuator = await Actuator.findByPk(id)
		if (!actuator) return { success: false, error: "Actuator not found." }

		// --- Check permission
		const permResult = await hasActuatorPermission(
			"Retrieve",
			actuator.esp32Id,
			userId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
        }
        
        // --- return actuator
        return { success: true, data: actuator }
	} catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Checks Actuator:Update permission.
 * - Updates the actuator.
 */
const updateActuator = async (
    data: ActuatorUpdate,
    userId: number
): Promise<SafeResult<Actuator>> => {
    try {
		// --- Find actuator
		const actuator = await Actuator.findByPk(data.id)
		if (!actuator) return { success: false, error: "Actuator not found." }

		// --- Check permission
		const permResult = await hasActuatorPermission(
			"Update",
			actuator.esp32Id,
			userId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
        }
        
        // --- Update and return actuator
        const { name, description, disabled } = data
		await actuator.update({ name, description, disabled })
		
		// --- Send to websocket too
		esp32.api.actuator.update(actuator)

        return { success: true, data: actuator }
	} catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Checks Actuator:Delete permission.
 * - Deletes the actuator.
 */
const deleteActuator = async (id: number, userId: number): Promise<SafeResult> => {
    try {
        // --- Find actuator
        const actuator = await Actuator.findOne({
            where: { id },
            attributes: ["id", "esp32Id"],
        })
		if (!actuator) return { success: false, error: "Actuator not found." }

		// --- Check permission
		const permResult = await hasActuatorPermission(
			"Update",
			actuator.esp32Id,
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
		await actuator.destroy()
		
		// --- Send to websocket
		esp32.api.actuator.destroy(actuator)

        return { success: true, data: undefined }
    } catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

//

export { createActuator, retrieveActuator, updateActuator, deleteActuator }