import { updatePin } from "~~/server/services/greenhouse/esp32/pin"
import { PinUpdateSchema } from "~~/shared/schema/pin"

//

export default defineEventHandler(async (event) => {
	// --- Validate body
	const body = await readBody(event)
	const bodyResult = PinUpdateSchema.safeParse(body)
	
	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: bodyResult.error.message,
		})
	}

	// --- Pass to pin service
	const userId = event.context.accessTokenPayload.id as number
	const updateResult = await updatePin(bodyResult.data, userId)
    
	if (!updateResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: updateResult.error,
		})
    }

	// --- Send the updated pin
	return updateResult.data.dataValues
})