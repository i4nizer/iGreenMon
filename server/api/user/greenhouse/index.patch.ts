import { Greenhouse } from "~~/server/models/greenhouse"
import { GreenhouseUpdateSchema } from "~~/shared/schema/greenhouse"

//

export default defineEventHandler(async (event) => {
	// --- Validate body
	const body = await readBody(event)
	const bodyResult = GreenhouseUpdateSchema.safeParse(body)
	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: bodyResult.error.message,
		})
	}

	// --- Find only the user's greenhouse
	const userId = event.context.accessTokenPayload.id as number
    const { id, name, description } = bodyResult.data
	const greenhouse = await Greenhouse.findOne({ where: { id, userId } })
    if (!greenhouse) {
		throw createError({
			statusCode: 404,
			statusMessage: "Greenhouse not found.",
		})
    }
    
    // --- Watch name change
    const isNameChanged = name != greenhouse.name
    if (isNameChanged) {
		const count = await Greenhouse.count({ where: { name, userId } })

		// --- Do not allow greenhouse with the same name
		if (count != 0) {
			throw createError({
				statusCode: 400,
				statusMessage: "Greenhouse name taken.",
			})
		}
	}

	// --- Update and send the greenhouse
	await greenhouse.update({ name, description })
	return greenhouse.dataValues
})