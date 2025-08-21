import { createSensor } from "~~/server/services/greenhouse/esp32/sensor"
import { SensorCreateSchema } from "~~/shared/schema/sensor"

//

export default defineEventHandler(async (event) => {
    // --- Validate data
    const body = await readBody(event)
    const bodyResult = SensorCreateSchema.safeParse(body)
    
    if (!bodyResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: bodyResult.error.message,
        })
    }

    // --- Pass to sensor service
    const userId = event.context.accessTokenPayload.id
    const createResult = await createSensor(bodyResult.data, userId)
    
    if (!createResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: createResult.error,
        })
    }

    // --- Return the sensor
    return createResult.data.dataValues
})