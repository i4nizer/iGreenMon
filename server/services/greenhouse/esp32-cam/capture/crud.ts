import { Capture } from "~~/server/models/capture";
import { CaptureCreate } from "~~/shared/schema/capture";
import { hasCapturePermission } from "./util";

//

/**
 * - Checks Capture:Create permission.
 * - Creates the capture.
 */
const createCapture = async (
    data: CaptureCreate,
    userId: number
): Promise<SafeResult<Capture>> => {
    try {
        // --- Check permission
        const permResult = await hasCapturePermission(
            "Create",
            data.esp32CamId,
            userId
        )

        if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
        }
        
        // --- Create and return the capture
        const capture = await Capture.create({ ...data })
        return { success: true, data: capture }
    } catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Checks Capture:Retrieve permission.
 * - Retrieves the capture.
 */
const retrieveCapture = async (
    id: number,
    userId: number
): Promise<SafeResult<Capture>> => {
    try {
		// --- Find capture
		const capture = await Capture.findByPk(id)
		if (!capture) return { success: false, error: "Capture not found." }

		// --- Check permission
		const permResult = await hasCapturePermission(
			"Retrieve",
			capture.esp32CamId,
			userId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
        }
        
        // --- return capture
        return { success: true, data: capture }
	} catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

//

export { createCapture, retrieveCapture }