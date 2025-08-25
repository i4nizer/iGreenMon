import { z } from "zod"
import { Greenhouse } from "~~/server/models/greenhouse"
import { Esp32 } from "~~/server/models/esp32"
import { Sensor } from "~~/server/models/sensor"
import { Hook } from "~~/server/models/hook"
import { HookSchema } from "~~/shared/schema/hook"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"

//

const QuerySchema = z.object({ ghname: z.string().min(1) })

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

	// --- Find greenhouse first
    const { ghname } = queryResult.data
    const gh = await Greenhouse.findOne({
        where: { name: ghname, userId },
        attributes: ["id"],
    })

    if (!gh) {
        throw createError({
            statusCode: 404,
            statusMessage: "Greenhouse not found.",
        })
    }

	// --- Check permission
	const permResult = await hasPermission(
		"Retrieve",
		"Hook",
		userId,
		gh.id
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

    // --- Find all of greenhouse's hooks
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
                        required: true,
                        attributes: ["id"],
                        include: [
                            {
                                model: Greenhouse,
                                as: "greenhouse",
                                where: { id: gh.id, userId },
                                required: true,
                                attributes: ["id"],
                            },
                        ],
                    },
                ],
            },
        ],
    })

    // --- Shape and send
    return hooks.map((o) => HookSchema.parse(o))
})
