import { z } from "zod";
import { retrieveThreshold } from "~~/server/services/greenhouse/threshold";

//

const ParamSchema = z.object({ thresholdid: z.coerce.number().int() })

//

export default defineEventHandler(async (event) => {
    // --- Get thresholdid from params
    const params = getRouterParams(event, { decode: true })
    const paramsResult = ParamSchema.safeParse(params)

    if (!paramsResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: paramsResult.error.message,
        })
    }

    // --- Pass retrieve to threshold service
    const userId = event.context.accessTokenPayload.id
    const { thresholdid } = paramsResult.data
    const retrieveResult = await retrieveThreshold(thresholdid, userId)

    if (!retrieveResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: retrieveResult.error,
        })
    }

    // --- return the threshold
    return retrieveResult.data.dataValues
})