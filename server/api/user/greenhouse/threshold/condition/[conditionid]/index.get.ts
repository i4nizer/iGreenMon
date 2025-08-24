import { z } from "zod";
import { retrieveCondition } from "~~/server/services/greenhouse/threshold/condition";

//

const ParamSchema = z.object({ conditionid: z.coerce.number().int() })

//

export default defineEventHandler(async (event) => {
    // --- Get conditionid from params
    const params = getRouterParams(event, { decode: true })
    const paramsResult = ParamSchema.safeParse(params)

    if (!paramsResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: paramsResult.error.message,
        })
    }

    // --- Pass retrieve to condition service
    const userId = event.context.accessTokenPayload.id
    const { conditionid } = paramsResult.data
    const retrieveResult = await retrieveCondition(conditionid, userId)

    if (!retrieveResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: retrieveResult.error,
        })
    }

    // --- return the condition
    return retrieveResult.data.dataValues
})