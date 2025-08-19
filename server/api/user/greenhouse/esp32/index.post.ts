import { createEsp32 } from "~~/server/services/greenhouse/esp32"
import { Esp32CreateSchema } from "~~/shared/schema/esp32"

//

export default defineEventHandler(async (event) => {
    // --- Validate data
    const body = await readBody(event)
    const bodyResult = Esp32CreateSchema.safeParse(body)
    
    if (!bodyResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: bodyResult.error.message,
        })
    }

    // --- Pass to esp32 service
    const userId = event.context.accessTokenPayload.id
    const createResult = await createEsp32(bodyResult.data, userId)
    
    if (!createResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: createResult.error,
        })
    }

    // --- Return the esp32
    return createResult.data.dataValues
})