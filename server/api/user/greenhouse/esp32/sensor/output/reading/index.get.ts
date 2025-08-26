import { Op } from "sequelize"
import { z } from "zod"
import { Esp32 } from "~~/server/models/esp32"
import { Output } from "~~/server/models/output"
import { Reading } from "~~/server/models/reading"
import { Sensor } from "~~/server/models/sensor"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"

//

const QuerySchema = z.object({
    alpha: z.coerce.date().optional(),
    omega: z.coerce.date().optional(),
    limit: z.coerce.number().int().optional().default(30),
    offset: z.coerce.number().int().optional().default(0),
    outputid: z.coerce.number().int(),
})

//

export default defineEventHandler(async (event) => {
    // --- Get query for pagination
    const query = getQuery(event)
    const queryResult = QuerySchema.safeParse(query)

    if (!queryResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: queryResult.error.message,
        })
    }

    // --- Trace greenhouseId from output
    const { outputid } = queryResult.data
    const userId = event.context.accessTokenPayload.id
    
    const output = await Output.findOne({
        where: { id: outputid },
        include: [
            {
                model: Sensor,
                as: "sensor",
                required: true,
                attributes: ["id"],
                include: [
                    {
                        model: Esp32,
                        as: "esp32",
                        required: true,
                        attributes: ["greenhouseId"],
                    },
                ],
            },
        ],
        attributes: ["id"],
    })

    if (!output) {
        throw createError({
            statusCode: 404,
            statusMessage: "Output not found.",
        })
    }

    const outputValues = output.dataValues as any as {
        id: number,
        sensor: {
            id: number,
            esp32: { greenhouseId: number },
        },
    }

    // --- Check permission
    const permResult = await hasPermission(
        "Retrieve",
        "Reading",
        userId,
        outputValues.sensor.esp32.greenhouseId
    )

    if (!permResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: permResult.error,
        })
    }

    // --- Craft filter
    const { alpha, omega, limit, offset } = queryResult.data
    const filter: any = { outputId: outputid }
    
    if (alpha && omega) filter.createdAt = { [Op.gte]: alpha, [Op.lte]: omega }
    else if (alpha) filter.createdAt = { [Op.gte]: alpha }
    else if (omega) filter.createdAt = { [Op.lte]: omega }

    // --- Find and send the data
    const readings = await Reading.findAll({
        where: filter,
        order: [["createdAt", "DESC"]],
        limit,
        offset,
    })

    return readings.map((r) => r.dataValues)
})