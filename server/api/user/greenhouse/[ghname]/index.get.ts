import { retrieveGH } from "~~/server/services/greenhouse"

//

export default defineEventHandler(async (event) => {
	// --- Get name from params
	const { ghname } = getRouterParams(event, { decode: true })

	// --- Pass to greenhouse service
	const userId = event.context.accessTokenPayload.id
	const retrieveResult = await retrieveGH(ghname, userId)
	if (!retrieveResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: retrieveResult.error,
		})
	}

	// --- Provide greenhouse
	return retrieveResult.data.dataValues
})
