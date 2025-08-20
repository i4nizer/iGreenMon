import { z } from "zod"
import { deletePin } from "~~/server/services/greenhouse/esp32/pin"

//

const ParamSchema = z.object({ pinid: z.coerce.number().int() })

//

export default defineEventHandler(async (event) => {
	// --- Get pinid from params
	const params = getRouterParams(event, { decode: true })
	const paramsResult = ParamSchema.safeParse(params)

	if (!paramsResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: paramsResult.error.message,
		})
	}

	// --- Pass retrieve to pin service
	const userId = event.context.accessTokenPayload.id
	const { pinid } = paramsResult.data
	const delResult = await deletePin(pinid, userId)

	if (!delResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: delResult.error,
		})
	}

	// --- nothin left
	return sendNoContent(event)
})
