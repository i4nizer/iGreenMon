import { updateEsp32Cam } from "~~/server/services/greenhouse/esp32-cam"
import { Esp32CamUpdateSchema } from "~~/shared/schema/esp32-cam"

//

export default defineEventHandler(async (event) => {
	// --- Validate body
	const body = await readBody(event)
	const bodyResult = Esp32CamUpdateSchema.safeParse(body)
	
	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: bodyResult.error.message,
		})
	}

	// --- Pass to esp32-cam service
	const userId = event.context.accessTokenPayload.id as number
	const updateResult = await updateEsp32Cam(bodyResult.data, userId)
    
	if (!updateResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: updateResult.error,
		})
    }

	// --- Send the updated esp32-cam
	return updateResult.data.dataValues
})