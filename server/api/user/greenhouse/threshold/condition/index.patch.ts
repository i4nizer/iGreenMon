import { updateCondition } from "~~/server/services/greenhouse/threshold/condition"
import { ConditionUpdateSchema } from "~~/shared/schema/condition"

//

export default defineEventHandler(async (event) => {
	// --- Validate body
	const body = await readBody(event)
	const bodyResult = ConditionUpdateSchema.safeParse(body)
	
	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: bodyResult.error.message,
		})
	}

	// --- Pass to condition service
	const userId = event.context.accessTokenPayload.id as number
	const updateResult = await updateCondition(bodyResult.data, userId)
    
	if (!updateResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: updateResult.error,
		})
    }

	// --- Send the updated condition
	return updateResult.data.dataValues
})