import { z } from "zod";
import { retrieveEsp32 } from "~~/server/services/greenhouse/esp32";

//

const ParamSchema = z.object({ esp32id: z.coerce.number().int() })

//

export default defineEventHandler(async (event) => {
    // --- Get esp32id from params
    const params = getRouterParams(event, { decode: true })
    const paramsResult = ParamSchema.safeParse(params)

    if (!paramsResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: paramsResult.error.message,
        })
    }

    // --- Pass retrieve to esp32 service
    const userId = event.context.accessTokenPayload.id
    const { esp32id } = paramsResult.data
    const retrieveResult = await retrieveEsp32(esp32id, userId)

    if (!retrieveResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: retrieveResult.error,
        })
    }

    // --- return the esp32
    return retrieveResult.data.dataValues
})