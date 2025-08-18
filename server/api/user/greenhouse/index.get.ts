import { Op } from "sequelize"
import { Crew } from "~~/server/models/crew"
import { Greenhouse } from "~~/server/models/greenhouse"

//

export default defineEventHandler(async (event) => {
    const userId = event.context.accessTokenPayload.id
    
    // --- Find user's crew instances
    const crews = await Crew.findAll({
        where: { userId },
        attributes: ["greenhouseId"],
    })
    
    // --- Provide all of the user's greenhouses
    const greenhouses = await Greenhouse.findAll({
        where: {
            [Op.or]: [
                { id: { [Op.in]: crews.map((c) => c.greenhouseId) } },
                { userId },
            ],
        },
    })

    return greenhouses.map(g => g.dataValues)
})