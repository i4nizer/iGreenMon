import { Greenhouse } from "~~/server/models/greenhouse"
import { GreenhouseCreateSchema } from "~~/shared/schema/greenhouse"

//

export default defineEventHandler(async (event) => {
    // --- Validate data
    const body = await readBody(event)
    const bodyResult = GreenhouseCreateSchema.safeParse(body)
    if (!bodyResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: bodyResult.error.message,
        })
    }

    // --- Do not allow greenhouse with the same name
    const userId = event.context.accessTokenPayload.id
    const { name } = bodyResult.data
    const count = await Greenhouse.count({ where: { name, userId } })
    if (count != 0) {
        throw createError({
            statusCode: 400,
            statusMessage: "Greenhouse name taken.",
        })
    }

    // --- Create the greenhouse
    const data = { ...bodyResult.data, userId }
    const greenhouse = await Greenhouse.create(data)

    // --- Return the greenhouse
    return greenhouse.dataValues
})