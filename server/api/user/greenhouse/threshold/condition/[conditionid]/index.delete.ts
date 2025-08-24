import { z } from "zod"
import { deleteCondition } from "~~/server/services/greenhouse/threshold/condition"

//

const ParamSchema = z.object({ conditionid: z.coerce.number().int() })

//

export default defineEventHandler(async (event) => {
	// --- Get conditionid from params
	const params = getRouterParams(event, { decode: true })
	const paramsResult = ParamSchema.safeParse(params)

	if (!paramsResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: paramsResult.error.message,
		})
	}

	// --- Pass retrieve to condition service
	const userId = event.context.accessTokenPayload.id
	const { conditionid } = paramsResult.data
	const delResult = await deleteCondition(conditionid, userId)

	if (!delResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: delResult.error,
		})
	}

	// --- nothin left
	return sendNoContent(event)
})
