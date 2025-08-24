import { createCondition } from "~~/server/services/greenhouse/threshold/condition"
import { ConditionCreateSchema } from "~~/shared/schema/condition"

//

export default defineEventHandler(async (event) => {
    // --- Validate data
    const body = await readBody(event)
    const bodyResult = ConditionCreateSchema.safeParse(body)
    
    if (!bodyResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: bodyResult.error.message,
        })
    }

    // --- Pass to condition service
    const userId = event.context.accessTokenPayload.id
    const createResult = await createCondition(bodyResult.data, userId)
    
    if (!createResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: createResult.error,
        })
    }

    // --- Return the condition
    return createResult.data.dataValues
})