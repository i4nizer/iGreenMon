import { deleteGH } from "~~/server/services/greenhouse"

//

export default defineEventHandler(async (event) => {
	// --- Get name from params
	const { ghname } = getRouterParams(event, { decode: true })

	// --- Delete greenhouse relative to user
	const userId = event.context.accessTokenPayload.id
	const delResult = await deleteGH(ghname, userId)
	if (!delResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: delResult.error,
		})
	}

	// --- Send result
	return delResult.data > 0
})
