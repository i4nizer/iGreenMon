import { updateGH } from "~~/server/services/greenhouse"
import { GreenhouseUpdateSchema } from "~~/shared/schema/greenhouse"

//

export default defineEventHandler(async (event) => {
	// --- Validate body
	const body = await readBody(event)
	const bodyResult = GreenhouseUpdateSchema.safeParse(body)
	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: bodyResult.error.message,
		})
	}

	// --- Pass to greenhouse service
	const userId = event.context.accessTokenPayload.id as number
	const updateResult = await updateGH(bodyResult.data, userId)
    if (!updateResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: updateResult.error,
		})
    }

	// --- Send the updated greenhouse
	return updateResult.data.dataValues
})