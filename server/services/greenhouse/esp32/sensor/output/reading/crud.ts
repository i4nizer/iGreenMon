import { Reading } from "~~/server/models/reading";
import { ReadingCreate } from "~~/shared/schema/reading";
import { hasReadingPermission } from "./util";

//

/**
 * - Checks Reading:Create permission.
 * - Creates the reading.
 */
const createReading = async (
    data: ReadingCreate,
    userId: number
): Promise<SafeResult<Reading>> => {
    try {
        // --- Check permission
        const permResult = await hasReadingPermission(
            "Create",
            data.outputId,
            userId
        )

        if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
        }
        
        // --- Create and return the reading
        const reading = await Reading.create({ ...data })
        return { success: true, data: reading }
    } catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

//

export { createReading }