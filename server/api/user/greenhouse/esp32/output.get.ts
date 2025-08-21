import { z } from "zod"
import { Sensor } from "~~/server/models/sensor"
import { Output } from "~~/server/models/output"
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
        "Output",
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

    // --- Find sensors for their id
    const sensors = await Sensor.findAll({
        where: { esp32Id: queryResult.data.esp32id },
        attributes: ["id"],
    })
    const sensorIds = sensors.map((s) => s.id)
    
    // --- Find all outputs and send
    const outputs = await Output.findAll({
        where: {
            sensorId: { [Op.in]: sensorIds }
        },
    })
    
    return outputs.map((g) => g.dataValues)
})
