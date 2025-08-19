import { updateEsp32 } from "~~/server/services/greenhouse/esp32"
import { Esp32UpdateSchema } from "~~/shared/schema/esp32"

//

export default defineEventHandler(async (event) => {
	// --- Validate body
	const body = await readBody(event)
	const bodyResult = Esp32UpdateSchema.safeParse(body)
	
	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: bodyResult.error.message,
		})
	}

	// --- Pass to esp32 service
	const userId = event.context.accessTokenPayload.id as number
	const updateResult = await updateEsp32(bodyResult.data, userId)
    
	if (!updateResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: updateResult.error,
		})
    }

	// --- Send the updated esp32
	return updateResult.data.dataValues
})