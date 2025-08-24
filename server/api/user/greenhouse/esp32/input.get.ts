import { z } from "zod"
import { Actuator } from "~~/server/models/actuator"
import { Input } from "~~/server/models/input"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"
import { Esp32 } from "~~/server/models/esp32"
import { Op } from "sequelize"

//

const QuerySchema = z.object({ esp32id: z.coerce.number().int() })

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

    // --- Trace esp32 for the greenhouseId
    const { esp32id } = queryResult.data
    const esp32 = await Esp32.findOne({
        where: { id: esp32id },
        attributes: ["greenhouseId"],
    })

    if (!esp32) {
        throw createError({
            statusCode: 400,
            statusMessage: "Esp32 not found.",
        })
    }

    // --- Check permission first
    const permResult = await hasPermission(
        "Retrieve",
        "Input",
        userId,
        esp32.greenhouseId
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

    // --- Find actuators for their id
    const actuators = await Actuator.findAll({
        where: { esp32Id: queryResult.data.esp32id },
        attributes: ["id"],
    })
    const actuatorIds = actuators.map((s) => s.id)
    
    // --- Find all inputs and send
    const inputs = await Input.findAll({
        where: {
            actuatorId: { [Op.in]: actuatorIds }
        },
    })
    
    return inputs.map((g) => g.dataValues)
})
