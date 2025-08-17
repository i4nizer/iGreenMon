import { z } from "zod"
import { Greenhouse } from "~~/server/models/greenhouse"
import { Permission } from "~~/server/models/permission"

//

const QuerySchema = z.object({ crewid: z.number().int() })

//

export default defineEventHandler(async (event) => {
    // --- Get crew Id from query
    const query = getQuery(event)
    const qResult = QuerySchema.safeParse(query)

    if (!qResult.success) {
        throw createError({
            statusCode: 400, 
            statusMessage: qResult.error.message,
        })
    }
    
    // --- Provide all
    const userId = event.context.accessTokenPayload.id
    const { crewid } = qResult.data
    const perms = await Permission.findAll({
        where: { crewId: crewid },
        include: [
            {
                model: Greenhouse,
                as: "greenhouse",
                where: { userId },
                required: true,
                foreignKey: "greenhouseId",
                attributes: ["id"],
            },
        ],
    })

    // --- return them permissions
    return perms.map((p) => p.dataValues)
})