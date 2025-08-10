import { createGH } from "~~/server/services/greenhouse"
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

    // --- Pass to greenhouse service
    const userId = event.context.accessTokenPayload.id
    const createResult = await createGH(bodyResult.data, userId)
    if (!createResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: createResult.error,
        })
    }

    // --- Return the greenhouse
    return createResult.data.dataValues
})