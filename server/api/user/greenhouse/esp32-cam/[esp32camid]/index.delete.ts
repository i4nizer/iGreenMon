import { z } from "zod"
import { deleteEsp32Cam } from "~~/server/services/greenhouse/esp32-cam"

//

const ParamSchema = z.object({ esp32camid: z.coerce.number().int() })

//

export default defineEventHandler(async (event) => {
	// --- Get esp32camid from params
	const params = getRouterParams(event, { decode: true })
	const paramsResult = ParamSchema.safeParse(params)

	if (!paramsResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: paramsResult.error.message,
		})
	}

	// --- Pass retrieve to esp32 service
	const userId = event.context.accessTokenPayload.id
	const { esp32camid } = paramsResult.data
	const delResult = await deleteEsp32Cam(esp32camid, userId)

	if (!delResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: delResult.error,
		})
	}

	// --- nothin left
	return sendNoContent(event)
})
