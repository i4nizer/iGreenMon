import { updateSensor } from "~~/server/services/greenhouse/esp32/sensor"
import { SensorUpdateSchema } from "~~/shared/schema/sensor"

//

export default defineEventHandler(async (event) => {
	// --- Validate body
	const body = await readBody(event)
	const bodyResult = SensorUpdateSchema.safeParse(body)
	
	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: bodyResult.error.message,
		})
	}

	// --- Pass to sensor service
	const userId = event.context.accessTokenPayload.id as number
	const updateResult = await updateSensor(bodyResult.data, userId)
    
	if (!updateResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: updateResult.error,
		})
    }

	// --- Send the updated sensor
	return updateResult.data.dataValues
})