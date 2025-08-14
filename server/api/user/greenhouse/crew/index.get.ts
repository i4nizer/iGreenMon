import { z } from "zod"
import { Crew } from "~~/server/models/crew"
import { Greenhouse } from "~~/server/models/greenhouse"
import { User } from "~~/server/models/user"

//

const QuerySchema = z.object({ ghname: z.string().min(1) })

//

export default defineEventHandler(async (event) => {
    // --- Get greenhouseId from query
    const query = getQuery(event)
    const qResult = QuerySchema.safeParse(query)
    
    if (!qResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: qResult.error.message,
        })
    }

    // --- Find and provide the greenhouse's crew
    const userId = event.context.accessTokenPayload.id
    const { ghname } = qResult.data
    const crews = await Crew.findAll({
        include: [
            {
                model: User,
                as: "user",
                required: true,
                foreignKey: "userId",
                attributes: ["name"],
            },
            {
                model: Greenhouse,
                as: "greenhouse",
                where: { name: ghname, userId },
                required: true,
                foreignKey: "greenhouseId",
                attributes: ["name"],
            },
        ],
    })
    
    return crews.map((g) => g.dataValues) as CrewGet[]
})