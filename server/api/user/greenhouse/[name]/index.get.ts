import { Greenhouse } from "~~/server/models/greenhouse"
import { GreenhouseSchema } from "~~/shared/schema/greenhouse"

//

export default defineEventHandler(async (event) => {
	// --- Get name from params
    const params = getRouterParams(event, { decode: true })
    const paramsResult = GreenhouseSchema
        .pick({ name: true })
        .safeParse(params)
    
    if (!paramsResult.success) {
        throw createError({
          statusCode: 400,
          statusMessage: paramsResult.error.message,
        })
    }
    
	// --- Find greenhouse relative to user
    const userId = event.context.accessTokenPayload.id
    const { name } = paramsResult.data
	const greenhouse = await Greenhouse.findOne({ where: { name, userId } })
	if (!greenhouse) {
		throw createError({
			statusCode: 404,
			statusMessage: "Greenhouse not found.",
		})
	}

	// --- Provide greenhouse
	return greenhouse.dataValues
})
