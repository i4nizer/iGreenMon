import { updateInput } from "~~/server/services/greenhouse/esp32/actuator/input"
import { InputUpdateSchema } from "~~/shared/schema/input"

//

export default defineEventHandler(async (event) => {
	// --- Validate body
	const body = await readBody(event)
	const bodyResult = InputUpdateSchema.safeParse(body)
	
	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: bodyResult.error.message,
		})
	}

	// --- Pass to input service
	const userId = event.context.accessTokenPayload.id as number
	const updateResult = await updateInput(bodyResult.data, userId)
    
	if (!updateResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: updateResult.error,
		})
    }

	// --- Send the updated input
	return updateResult.data.dataValues
})