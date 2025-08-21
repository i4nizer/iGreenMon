import { z } from "zod"
import { deleteSensor } from "~~/server/services/greenhouse/esp32/sensor"

//

const ParamSchema = z.object({ sensorid: z.coerce.number().int() })

//

export default defineEventHandler(async (event) => {
	// --- Get sensorid from params
	const params = getRouterParams(event, { decode: true })
	const paramsResult = ParamSchema.safeParse(params)

	if (!paramsResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: paramsResult.error.message,
		})
	}

	// --- Pass retrieve to sensor service
	const userId = event.context.accessTokenPayload.id
	const { sensorid } = paramsResult.data
	const delResult = await deleteSensor(sensorid, userId)

	if (!delResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: delResult.error,
		})
	}

	// --- nothin left
	return sendNoContent(event)
})
