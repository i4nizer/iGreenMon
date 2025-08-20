import { Esp32 } from "~~/server/models/esp32"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"
import { PermissionType } from "~~/shared/schema/permission"

//

const hasPinPermission = async (
    type: PermissionType,
    esp32Id: number,
    userId: number
): Promise<SafeResult<boolean>> => {
    try {
		// --- Trace esp32 for greenhouseId
		const esp32 = await Esp32.findOne({
			where: { id: esp32Id },
			attributes: ["greenhouseId"],
		})
		if (!esp32) return { success: false, error: "Esp32 not found." }

		// --- Check permission
		const permResult = await hasPermission(
			type,
			"Pin",
			userId,
			esp32.greenhouseId
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

export { hasPinPermission }