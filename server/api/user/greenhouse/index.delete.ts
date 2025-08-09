import { Greenhouse } from "~~/server/models/greenhouse"
import { GreenhouseSchema } from "~~/shared/schema/greenhouse"

//

export default defineEventHandler(async (event) => {
    // --- Validate body
    const body = await readBody(event)
    const bodyResult = GreenhouseSchema
        .pick({ name: true })
        .safeParse(body)
    if (!bodyResult.success) {
        throw createError({
          statusCode: 400,
          statusMessage: bodyResult.error.message,
        })
    }

    // --- Delete relative to user
    const userId = event.context.accessTokenPayload.id
    const { name } = bodyResult.data
    const count = await Greenhouse.destroy({ where: { name, userId } })
    
    // --- Send result
    return { success: count > 0 }
})