import { updateOutput } from "~~/server/services/greenhouse/esp32/sensor/output"
import { OutputUpdateSchema } from "~~/shared/schema/output"

//

export default defineEventHandler(async (event) => {
	// --- Validate body
	const body = await readBody(event)
	const bodyResult = OutputUpdateSchema.safeParse(body)
	
	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: bodyResult.error.message,
		})
	}

	// --- Pass to output service
	const userId = event.context.accessTokenPayload.id as number
	const updateResult = await updateOutput(bodyResult.data, userId)
    
	if (!updateResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: updateResult.error,
		})
    }

	// --- Send the updated output
	return updateResult.data.dataValues
})