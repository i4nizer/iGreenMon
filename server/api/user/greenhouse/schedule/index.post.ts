import { createSchedule } from "~~/server/services/greenhouse/schedule"
import { ScheduleCreateSchema } from "~~/shared/schema/schedule"

//

export default defineEventHandler(async (event) => {
    // --- Validate data
    const body = await readBody(event)
    const bodyResult = ScheduleCreateSchema.safeParse(body)
    
    if (!bodyResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: bodyResult.error.message,
        })
    }

    // --- Pass to schedule service
    const userId = event.context.accessTokenPayload.id
    const createResult = await createSchedule(bodyResult.data, userId)
    
    if (!createResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: createResult.error,
        })
    }

    // --- Return the schedule
    return createResult.data.dataValues
})