import { updateThreshold } from "~~/server/services/greenhouse/threshold"
import { ThresholdUpdateSchema } from "~~/shared/schema/threshold"

//

export default defineEventHandler(async (event) => {
	// --- Validate body
	const body = await readBody(event)
	const bodyResult = ThresholdUpdateSchema.safeParse(body)
	
	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: bodyResult.error.message,
		})
	}

	// --- Pass to threshold service
	const userId = event.context.accessTokenPayload.id as number
	const updateResult = await updateThreshold(bodyResult.data, userId)
    
	if (!updateResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: updateResult.error,
		})
    }

	// --- Send the updated threshold
	return updateResult.data.dataValues
})