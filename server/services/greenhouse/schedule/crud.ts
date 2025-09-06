import esp32 from "~~/server/services/esp32"
import { ScheduleCreate, ScheduleUpdate } from "#shared/schema/schedule"
import { Schedule } from "~~/server/models/schedule"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"

//

/**
 * - Checks for Schedule:Create permission.
 * - Creates schedule and token.
 */
const createSchedule = async (
	data: ScheduleCreate,
	userId: number
): Promise<SafeResult<Schedule>> => {
	try {
		// --- Check for permission
		const permResult = await hasPermission(
			"Create",
			"Schedule",
			userId,
			data.greenhouseId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// --- Create and return the schedule
		const schedule = await Schedule.create({ ...data })
		return { success: true, data: schedule }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Checks for Schedule:Retrive permission.
 * - Finds the schedule.
 */
const retrieveSchedule = async (
	id: number,
	userId: number
): Promise<SafeResult<Schedule>> => {
	try {
		// --- Find schedule
		const schedule = await Schedule.findByPk(id)
		if (!schedule) return { success: false, error: "Schedule not found." }

		// --- Check for permission
		const permResult = await hasPermission(
			"Retrieve",
			"Schedule",
			userId,
			schedule.greenhouseId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// --- passed, return it
		return { success: true, data: schedule }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Checks Schedule:Update permission.
 * - Updates the schedule.
 */
const updateSchedule = async (
	data: ScheduleUpdate,
	userId: number
): Promise<SafeResult<Schedule>> => {
	try {
		// --- Find schedule
		const schedule = await Schedule.findByPk(data.id)
		if (!schedule) return { success: false, error: "Schedule not found." }

		// --- Check for permission
		const permResult = await hasPermission(
			"Update",
			"Schedule",
			userId,
			schedule.greenhouseId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// passed, update and return it
		const { name, days, times, disabled } = data
		await schedule.update({ name, days, times, disabled })

		// --- Send to websocket
		esp32.api.schedule.update(schedule)

		return { success: true, data: schedule }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Checks Schedule:Delete permission.
 * - Deletes schedule.
 */
const deleteSchedule = async (id: number, userId: number): Promise<SafeResult> => {
	try {
		// --- Find schedule
		const schedule = await Schedule.findOne({
			where: { id },
			attributes: ["id", "greenhouseId"],
		})
		if (!schedule) return { success: false, error: "Schedule not found." }

		// --- Check for permission
		const permResult = await hasPermission(
			"Delete",
			"Schedule",
			userId,
			schedule.greenhouseId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// --- passed, delete it
		await schedule.destroy()

		// --- Send to websocket
		esp32.api.schedule.destroy(schedule)

		return { success: true, data: undefined }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

//

export { createSchedule, retrieveSchedule, updateSchedule, deleteSchedule }
