import { Pin } from "~~/server/models/pin";
import { PinCreate, PinUpdate } from "~~/shared/schema/pin";
import { hasPinPermission } from "./util";

//

/**
 * - Checks Pin:Create permission.
 * - Creates the pin.
 */
const createPin = async (
    data: PinCreate,
    userId: number
): Promise<SafeResult<Pin>> => {
    try {
        // --- Check permission
        const permResult = await hasPinPermission(
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
        
        // --- Create and return the pin
        const pin = await Pin.create({ ...data })
        return { success: true, data: pin }
    } catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Checks Pin:Retrieve permission.
 * - Retrieves the pin.
 */
const retrievePin = async (
    id: number,
    userId: number
): Promise<SafeResult<Pin>> => {
    try {
		// --- Find pin
		const pin = await Pin.findByPk(id)
		if (!pin) return { success: false, error: "Pin not found." }

		// --- Check permission
		const permResult = await hasPinPermission(
			"Retrieve",
			pin.esp32Id,
			userId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
        }
        
        // --- return pin
        return { success: true, data: pin }
	} catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Checks Pin:Update permission.
 * - Updates the pin.
 */
const updatePin = async (
    data: PinUpdate,
    userId: number
): Promise<SafeResult<Pin>> => {
    try {
		// --- Find pin
		const pin = await Pin.findByPk(data.id)
		if (!pin) return { success: false, error: "Pin not found." }

		// --- Check permission
		const permResult = await hasPinPermission(
			"Update",
			pin.esp32Id,
			userId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
        }
        
        // --- Update and return pin
        const { type, mode, number } = data
        await pin.update({ type, mode, number })
        return { success: true, data: pin }
	} catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Checks Pin:Delete permission.
 * - Deletes the pin.
 */
const deletePin = async (id: number, userId: number): Promise<SafeResult> => {
    try {
        // --- Find pin
        const pin = await Pin.findOne({
            where: { id },
            attributes: ["id", "esp32Id"],
        })
		if (!pin) return { success: false, error: "Pin not found." }

		// --- Check permission
		const permResult = await hasPinPermission(
			"Update",
			pin.esp32Id,
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
        await pin.destroy()
        return { success: true, data: undefined }
    } catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

//

export { createPin, retrievePin, updatePin, deletePin }