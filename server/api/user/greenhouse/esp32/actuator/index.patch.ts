import { updateActuator } from "~~/server/services/greenhouse/esp32/actuator"
import { ActuatorUpdateSchema } from "~~/shared/schema/actuator"

//

export default defineEventHandler(async (event) => {
	// --- Validate body
	const body = await readBody(event)
	const bodyResult = ActuatorUpdateSchema.safeParse(body)
	
	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: bodyResult.error.message,
		})
	}

	// --- Pass to actuator service
	const userId = event.context.accessTokenPayload.id as number
	const updateResult = await updateActuator(bodyResult.data, userId)
    
	if (!updateResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: updateResult.error,
		})
    }

	// --- Send the updated actuator
	return updateResult.data.dataValues
})