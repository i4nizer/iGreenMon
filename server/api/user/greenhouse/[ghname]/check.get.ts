import { Greenhouse } from "~~/server/models/greenhouse"

//

export default defineEventHandler(async (event) => {
    // --- Get name from params
    const { ghname } = getRouterParams(event, { decode: true })
    
    // --- Count greenhouse with same name relative to user
    const userId = event.context.accessTokenPayload.id
    const count = await Greenhouse.count({ where: { name: ghname, userId } })
    
    // --- Return state
    return count <= 0
})