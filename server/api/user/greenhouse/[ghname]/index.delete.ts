import { Greenhouse } from "~~/server/models/greenhouse"

//

export default defineEventHandler(async (event) => {
	// --- Get name from params
	const { ghname } = getRouterParams(event, { decode: true })

	// --- Delete greenhouse relative to user
	const userId = event.context.accessTokenPayload.id
	const count = await Greenhouse.destroy({
		where: { name: ghname, userId },
	})

	if (count <= 0) {
		throw createError({
			statusCode: 404,
			statusMessage: "Greenhouse not found.",
		})
	}

	// --- Send result
	return count > 0
})
