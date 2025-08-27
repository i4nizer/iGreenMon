import { Esp32Cam } from "~~/server/models/esp32-cam"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"
import { PermissionType } from "~~/shared/schema/permission"

//

const hasCapturePermission = async (
    type: PermissionType,
    esp32CamId: number,
    userId: number
): Promise<SafeResult<boolean>> => {
    try {
		// --- Trace esp32Cam for greenhouseId
		const esp32Cam = await Esp32Cam.findOne({
			where: { id: esp32CamId },
			attributes: ["greenhouseId"],
		})
		if (!esp32Cam) return { success: false, error: "Esp32Cam not found." }

		// --- Check permission
		const permResult = await hasPermission(
			type,
			"Capture",
			userId,
			esp32Cam.greenhouseId
		)
		if (!permResult.success) return permResult

        // --- return state
		return { success: true, data: permResult.data }
	} catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

//

export { hasCapturePermission }