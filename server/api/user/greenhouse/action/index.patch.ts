import { updateAction } from "~~/server/services/greenhouse/action"
import { ActionUpdateSchema } from "~~/shared/schema/action"

//

export default defineEventHandler(async (event) => {
	// --- Validate body
	const body = await readBody(event)
	const bodyResult = ActionUpdateSchema.safeParse(body)
	
	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: bodyResult.error.message,
		})
	}

	// --- Pass to action service
	const userId = event.context.accessTokenPayload.id as number
	const updateResult = await updateAction(bodyResult.data, userId)
    
	if (!updateResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: updateResult.error,
		})
    }

	// --- Send the updated action
	return updateResult.data.dataValues
})