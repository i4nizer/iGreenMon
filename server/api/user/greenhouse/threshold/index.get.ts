import { z } from "zod"
import { Threshold } from "~~/server/models/threshold"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"

//

const QuerySchema = z.object({ ghid: z.coerce.number().int() })

//

export default defineEventHandler(async (event) => {
    // --- Get details
    const userId = event.context.accessTokenPayload.id
    const queryResult = await getValidatedQuery(event, QuerySchema.safeParse)
    
    if (!queryResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: queryResult.error.message,
        })
    }
    
    // --- Check permission first
    const { ghid } = queryResult.data
    const permResult = await hasPermission(
        "Retrieve",
        "Threshold",
        userId,
        ghid
    )

    // --- An error or not permitted
    if (!permResult.success || !permResult.data) {
        const error = permResult.success
            ? "User doesn't have permission."
            : permResult.error
        throw createError({
            statusCode: 400,
            statusMessage: error,
        })
    }

    // --- Provide all of the greenhouse's thresholds
    const thresholds = await Threshold.findAll({ where: { greenhouseId: ghid } })
    return thresholds.map(g => g.dataValues)
})