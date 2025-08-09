import { Greenhouse } from "~~/server/models/greenhouse"

//

export default defineEventHandler(async (event) => {
	// --- Get name from params
	const { ghname } = getRouterParams(event, { decode: true })

	// --- Find greenhouse relative to user
	const userId = event.context.accessTokenPayload.id
	const greenhouse = await Greenhouse.findOne({
		where: { name: ghname, userId },
	})

	if (!greenhouse) {
		throw createError({
			statusCode: 404,
			statusMessage: "Greenhouse not found.",
		})
	}

	// --- Provide greenhouse
	return greenhouse.dataValues
})
