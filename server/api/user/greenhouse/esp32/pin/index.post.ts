import { createPin } from "~~/server/services/greenhouse/esp32/pin"
import { PinCreateSchema } from "~~/shared/schema/pin"

//

export default defineEventHandler(async (event) => {
    // --- Validate data
    const body = await readBody(event)
    const bodyResult = PinCreateSchema.safeParse(body)
    
    if (!bodyResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: bodyResult.error.message,
        })
    }

    // --- Pass to pin service
    const userId = event.context.accessTokenPayload.id
    const createResult = await createPin(bodyResult.data, userId)
    
    if (!createResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: createResult.error,
        })
    }

    // --- Return the pin
    return createResult.data.dataValues
})