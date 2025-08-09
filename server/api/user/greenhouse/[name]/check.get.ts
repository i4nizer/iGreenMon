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
    
    // --- Count greenhouse with same name relative to user
    const userId = event.context.accessTokenPayload.id
  const { name } = paramsResult.data
  console.log(name)
    const count = await Greenhouse.count({ where: { name, userId } })
    
    // --- Return state
    return count <= 0
})