import { createInput } from "~~/server/services/greenhouse/esp32/actuator/input"
import { InputCreateSchema } from "~~/shared/schema/input"

//

export default defineEventHandler(async (event) => {
    // --- Validate data
    const body = await readBody(event)
    const bodyResult = InputCreateSchema.safeParse(body)
    
    if (!bodyResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: bodyResult.error.message,
        })
    }

    // --- Pass to input service
    const userId = event.context.accessTokenPayload.id
    const createResult = await createInput(bodyResult.data, userId)
    
    if (!createResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: createResult.error,
        })
    }

    // --- Return the input
    return createResult.data.dataValues
})