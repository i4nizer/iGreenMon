import { createAction } from "~~/server/services/greenhouse/action"
import { ActionCreateSchema } from "~~/shared/schema/action"

//

export default defineEventHandler(async (event) => {
    // --- Validate data
    const body = await readBody(event)
    const bodyResult = ActionCreateSchema.safeParse(body)
    
    if (!bodyResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: bodyResult.error.message,
        })
    }

    // --- Pass to action service
    const userId = event.context.accessTokenPayload.id
    const createResult = await createAction(bodyResult.data, userId)
    
    if (!createResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: createResult.error,
        })
    }

    // --- Return the action
    return createResult.data.dataValues
})