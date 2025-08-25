import { z } from "zod"
import { deleteAction } from "~~/server/services/greenhouse/action"

//

const ParamSchema = z.object({ actionid: z.coerce.number().int() })

//

export default defineEventHandler(async (event) => {
	// --- Get actionid from params
	const params = getRouterParams(event, { decode: true })
	const paramsResult = ParamSchema.safeParse(params)

	if (!paramsResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: paramsResult.error.message,
		})
	}

	// --- Pass retrieve to action service
	const userId = event.context.accessTokenPayload.id
	const { actionid } = paramsResult.data
	const delResult = await deleteAction(actionid, userId)

	if (!delResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: delResult.error,
		})
	}

	// --- nothin left
	return sendNoContent(event)
})
