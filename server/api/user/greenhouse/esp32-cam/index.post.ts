import { createEsp32Cam } from "~~/server/services/greenhouse/esp32-cam"
import { Esp32CamCreateSchema } from "~~/shared/schema/esp32-cam"

//

export default defineEventHandler(async (event) => {
    // --- Validate data
    const body = await readBody(event)
    const bodyResult = Esp32CamCreateSchema.safeParse(body)
    
    if (!bodyResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: bodyResult.error.message,
        })
    }

    // --- Pass to esp32-cam service
    const userId = event.context.accessTokenPayload.id
    const createResult = await createEsp32Cam(bodyResult.data, userId)
    
    if (!createResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: createResult.error,
        })
    }

    // --- Return the esp32-cam
    return createResult.data.dataValues
})