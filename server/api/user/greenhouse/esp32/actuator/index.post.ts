import { createActuator } from "~~/server/services/greenhouse/esp32/actuator"
import { ActuatorCreateSchema } from "~~/shared/schema/actuator"

//

export default defineEventHandler(async (event) => {
    // --- Validate data
    const body = await readBody(event)
    const bodyResult = ActuatorCreateSchema.safeParse(body)
    
    if (!bodyResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: bodyResult.error.message,
        })
    }

    // --- Pass to actuator service
    const userId = event.context.accessTokenPayload.id
    const createResult = await createActuator(bodyResult.data, userId)
    
    if (!createResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: createResult.error,
        })
    }

    // --- Return the actuator
    return createResult.data.dataValues
})