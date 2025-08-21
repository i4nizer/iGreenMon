import { z } from "zod"
import { deleteActuator } from "~~/server/services/greenhouse/esp32/actuator"

//

const ParamSchema = z.object({ actuatorid: z.coerce.number().int() })

//

export default defineEventHandler(async (event) => {
	// --- Get actuatorid from params
	const params = getRouterParams(event, { decode: true })
	const paramsResult = ParamSchema.safeParse(params)

	if (!paramsResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: paramsResult.error.message,
		})
	}

	// --- Pass retrieve to actuator service
	const userId = event.context.accessTokenPayload.id
	const { actuatorid } = paramsResult.data
	const delResult = await deleteActuator(actuatorid, userId)

	if (!delResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: delResult.error,
		})
	}

	// --- nothin left
	return sendNoContent(event)
})
