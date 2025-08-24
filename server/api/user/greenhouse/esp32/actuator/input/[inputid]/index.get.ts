import { z } from "zod";
import { retrieveInput } from "~~/server/services/greenhouse/esp32/actuator/input";

//

const ParamSchema = z.object({ inputid: z.coerce.number().int() })

//

export default defineEventHandler(async (event) => {
    // --- Get inputid from params
    const params = getRouterParams(event, { decode: true })
    const paramsResult = ParamSchema.safeParse(params)

    if (!paramsResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: paramsResult.error.message,
        })
    }

    // --- Pass retrieve to input service
    const userId = event.context.accessTokenPayload.id
    const { inputid } = paramsResult.data
    const retrieveResult = await retrieveInput(inputid, userId)

    if (!retrieveResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: retrieveResult.error,
        })
    }

    // --- return the input
    return retrieveResult.data.dataValues
})