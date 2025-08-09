import { Greenhouse } from "~~/server/models/greenhouse"

//

export default defineEventHandler(async (event) => {
    // --- Provide all of the user's greenhouses
    const id = event.context.accessTokenPayload.id
    const greenhouses = await Greenhouse.findAll({ where: { userId: id } })
    return greenhouses.map(g => g.dataValues)
})