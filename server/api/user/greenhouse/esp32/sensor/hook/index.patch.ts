import { updateHook } from "~~/server/services/greenhouse/esp32/sensor/hook"
import { HookUpdateSchema } from "~~/shared/schema/hook"

//

export default defineEventHandler(async (event) => {
	// --- Validate body
	const body = await readBody(event)
	const bodyResult = HookUpdateSchema.safeParse(body)
	
	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: bodyResult.error.message,
		})
	}

	// --- Pass to hook service
	const userId = event.context.accessTokenPayload.id as number
	const updateResult = await updateHook(bodyResult.data, userId)
    
	if (!updateResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: updateResult.error,
		})
    }

	// --- Send the updated hook
	return updateResult.data.dataValues
})