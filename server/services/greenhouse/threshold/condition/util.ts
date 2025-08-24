import { Threshold } from "~~/server/models/threshold"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"
import { PermissionType } from "~~/shared/schema/permission"

//

const hasConditionPermission = async (
    type: PermissionType,
    thresholdId: number,
    userId: number
): Promise<SafeResult<boolean>> => {
    try {
		// --- Trace threshold for greenhouseId
		const threshold = await Threshold.findOne({
			where: { id: thresholdId },
			attributes: ["greenhouseId"],
		})
		if (!threshold) return { success: false, error: "Threshold not found." }

		// --- Check permission
		const permResult = await hasPermission(
			type,
			"Condition",
			userId,
			threshold.greenhouseId
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

export { hasConditionPermission }