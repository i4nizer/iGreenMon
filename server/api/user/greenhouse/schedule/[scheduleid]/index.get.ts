import { z } from "zod";
import { retrieveSchedule } from "~~/server/services/greenhouse/schedule";

//

const ParamSchema = z.object({ scheduleid: z.coerce.number().int() })

//

export default defineEventHandler(async (event) => {
    // --- Get scheduleid from params
    const params = getRouterParams(event, { decode: true })
    const paramsResult = ParamSchema.safeParse(params)

    if (!paramsResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: paramsResult.error.message,
        })
    }

    // --- Pass retrieve to schedule service
    const userId = event.context.accessTokenPayload.id
    const { scheduleid } = paramsResult.data
    const retrieveResult = await retrieveSchedule(scheduleid, userId)

    if (!retrieveResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: retrieveResult.error,
        })
    }

    // --- return the schedule
    return retrieveResult.data.dataValues
})