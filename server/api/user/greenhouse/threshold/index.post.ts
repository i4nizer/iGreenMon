import { createThreshold } from "~~/server/services/greenhouse/threshold"
import { ThresholdCreateSchema } from "~~/shared/schema/threshold"

//

export default defineEventHandler(async (event) => {
    // --- Validate data
    const body = await readBody(event)
    const bodyResult = ThresholdCreateSchema.safeParse(body)
    
    if (!bodyResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: bodyResult.error.message,
        })
    }

    // --- Pass to threshold service
    const userId = event.context.accessTokenPayload.id
    const createResult = await createThreshold(bodyResult.data, userId)
    
    if (!createResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: createResult.error,
        })
    }

    // --- Return the threshold
    return createResult.data.dataValues
})