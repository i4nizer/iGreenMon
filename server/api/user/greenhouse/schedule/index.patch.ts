import { updateSchedule } from "~~/server/services/greenhouse/schedule"
import { ScheduleUpdateSchema } from "~~/shared/schema/schedule"

//

export default defineEventHandler(async (event) => {
	// --- Validate body
	const body = await readBody(event)
	const bodyResult = ScheduleUpdateSchema.safeParse(body)
	
	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: bodyResult.error.message,
		})
	}

	// --- Pass to schedule service
	const userId = event.context.accessTokenPayload.id as number
	const updateResult = await updateSchedule(bodyResult.data, userId)
    
	if (!updateResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: updateResult.error,
		})
    }

	// --- Send the updated schedule
	return updateResult.data.dataValues
})