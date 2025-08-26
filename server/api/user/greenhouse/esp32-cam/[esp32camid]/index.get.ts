import { z } from "zod";
import { retrieveEsp32Cam } from "~~/server/services/greenhouse/esp32-cam";

//

const ParamSchema = z.object({ esp32camid: z.coerce.number().int() })

//

export default defineEventHandler(async (event) => {
    // --- Get esp32camid from params
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
    const { esp32camid } = paramsResult.data
    const retrieveResult = await retrieveEsp32Cam(esp32camid, userId)

    if (!retrieveResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: retrieveResult.error,
        })
    }

    // --- return the esp32-cam
    return retrieveResult.data.dataValues
})