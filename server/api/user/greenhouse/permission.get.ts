import { z } from "zod"
import { Crew } from "~~/server/models/crew"
import { Greenhouse } from "~~/server/models/greenhouse"
import { Permission } from "~~/server/models/permission"

//

const QuerySchema = z.object({ ghname: z.string().min(1) })

//

export default defineEventHandler(async (event) => {
    // --- Get greenhouse.name from query
    const query = getQuery(event)
    const qResult = QuerySchema.safeParse(query)

    if (!qResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: qResult.error.message,
        })
    }

    // --- Find all greenhouse's permissions
    const { ghname } = qResult.data
    const perms = await Permission.findAll({
        include: [
            {
                model: Crew,
                as: "crew",
                required: true,
                foreignKey: "crewId",
                attributes: ["id"],
                include: [
                    {
                        model: Greenhouse,
                        as: "greenhouse",
                        where: { name: ghname },
                        required: true,
                        foreignKey: "greenhouseId",
                        attributes: ["id"],
                    },
                ],
            },
        ],
    })

    // --- Provide the permissions
    return perms.map((p) => p.dataValues)
})