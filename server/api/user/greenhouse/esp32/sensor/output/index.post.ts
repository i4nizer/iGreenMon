import { createOutput } from "~~/server/services/greenhouse/esp32/sensor/output"
import { OutputCreateSchema } from "~~/shared/schema/output"

//

export default defineEventHandler(async (event) => {
    // --- Validate data
    const body = await readBody(event)
    const bodyResult = OutputCreateSchema.safeParse(body)
    
    if (!bodyResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: bodyResult.error.message,
        })
    }

    // --- Pass to output service
    const userId = event.context.accessTokenPayload.id
    const createResult = await createOutput(bodyResult.data, userId)
    
    if (!createResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: createResult.error,
        })
    }

    // --- Return the output
    return createResult.data.dataValues
})