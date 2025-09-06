import { Condition } from "~~/server/models/condition";
import { ConditionCreate, ConditionUpdate } from "~~/shared/schema/condition";
import { hasConditionPermission } from "./util";
import esp32 from "~~/server/services/esp32";

//

/**
 * - Checks Condition:Create permission.
 * - Creates the condition.
 */
const createCondition = async (
    data: ConditionCreate,
    userId: number
): Promise<SafeResult<Condition>> => {
    try {
        // --- Check permission
        const permResult = await hasConditionPermission(
            "Create",
            data.thresholdId,
            userId
        )

        if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
        }
        
        // --- Create and return the condition
		const condition = await Condition.create({ ...data })
		
		// --- Send to websocket
		esp32.api.condition.create(condition)

        return { success: true, data: condition }
    } catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Checks Condition:Retrieve permission.
 * - Retrieves the condition.
 */
const retrieveCondition = async (
    id: number,
    userId: number
): Promise<SafeResult<Condition>> => {
    try {
		// --- Find condition
		const condition = await Condition.findByPk(id)
		if (!condition) return { success: false, error: "Condition not found." }

		// --- Check permission
		const permResult = await hasConditionPermission(
			"Retrieve",
			condition.thresholdId,
			userId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
        }
        
        // --- return condition
        return { success: true, data: condition }
	} catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Checks Condition:Update permission.
 * - Updates the condition.
 */
const updateCondition = async (
    data: ConditionUpdate,
    userId: number
): Promise<SafeResult<Condition>> => {
    try {
		// --- Find condition
		const condition = await Condition.findByPk(data.id)
		if (!condition) return { success: false, error: "Condition not found." }

		// --- Check permission
		const permResult = await hasConditionPermission(
			"Update",
			condition.thresholdId,
			userId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// --- Update and return condition
		const { type, value, outputId } = data
		await condition.update({ type, value, outputId })

		// --- Send to websocket
		esp32.api.condition.update(condition)

		return { success: true, data: condition }
	} catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Checks Condition:Delete permission.
 * - Deletes the condition.
 */
const deleteCondition = async (id: number, userId: number): Promise<SafeResult> => {
    try {
		// --- Find condition
		const condition = await Condition.findOne({
			where: { id },
			attributes: ["id", "thresholdId"],
		})
		if (!condition) return { success: false, error: "Condition not found." }

		// --- Check permission
		const permResult = await hasConditionPermission(
			"Update",
			condition.thresholdId,
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
		await condition.destroy()

		// --- Send to websocket
		esp32.api.condition.destroy(condition)

		return { success: true, data: undefined }
	} catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

//

export { createCondition, retrieveCondition, updateCondition, deleteCondition }