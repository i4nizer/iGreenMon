import { z } from "zod"
import { deleteHook } from "~~/server/services/greenhouse/esp32/sensor/hook"

//

const ParamSchema = z.object({ hookid: z.coerce.number().int() })

//

export default defineEventHandler(async (event) => {
	// --- Get hookid from params
	const params = getRouterParams(event, { decode: true })
	const paramsResult = ParamSchema.safeParse(params)

	if (!paramsResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: paramsResult.error.message,
		})
	}

	// --- Pass retrieve to hook service
	const userId = event.context.accessTokenPayload.id
	const { hookid } = paramsResult.data
	const delResult = await deleteHook(hookid, userId)

	if (!delResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: delResult.error,
		})
	}

	// --- nothin left
	return sendNoContent(event)
})
