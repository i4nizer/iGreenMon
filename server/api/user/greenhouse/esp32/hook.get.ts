import { z } from "zod"
import { Sensor } from "~~/server/models/sensor"
import { Hook } from "~~/server/models/hook"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"
import { Esp32 } from "~~/server/models/esp32"
import { HookSchema } from "~~/shared/schema/hook"

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
        "Hook",
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

    // --- Find all hooks and send
    const hooks = await Hook.findAll({
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
                        where: { id: esp32id },
                        required: true,
                        attributes: ["id"],
                    },
                ],
			},
		],
	})
    
    return hooks.map((g) => HookSchema.parse(g.dataValues))
})
