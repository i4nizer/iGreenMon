import { z } from "zod"
import { deleteOutput } from "~~/server/services/greenhouse/esp32/sensor/output"

//

const ParamSchema = z.object({ outputid: z.coerce.number().int() })

//

export default defineEventHandler(async (event) => {
	// --- Get outputid from params
	const params = getRouterParams(event, { decode: true })
	const paramsResult = ParamSchema.safeParse(params)

	if (!paramsResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: paramsResult.error.message,
		})
	}

	// --- Pass retrieve to output service
	const userId = event.context.accessTokenPayload.id
	const { outputid } = paramsResult.data
	const delResult = await deleteOutput(outputid, userId)

	if (!delResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: delResult.error,
		})
	}

	// --- nothin left
	return sendNoContent(event)
})
