import { createHook } from "~~/server/services/greenhouse/esp32/sensor/hook"
import { HookCreateSchema } from "~~/shared/schema/hook"

//

export default defineEventHandler(async (event) => {
    // --- Validate data
    const body = await readBody(event)
    const bodyResult = HookCreateSchema.safeParse(body)
    
    if (!bodyResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: bodyResult.error.message,
        })
    }

    // --- Pass to hook service
    const userId = event.context.accessTokenPayload.id
    const createResult = await createHook(bodyResult.data, userId)
    
    if (!createResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: createResult.error,
        })
    }

    // --- Return the hook
    return createResult.data.dataValues
})