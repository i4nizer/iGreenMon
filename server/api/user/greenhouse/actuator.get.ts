import { z } from "zod"
import { Esp32 } from "~~/server/models/esp32"
import { Greenhouse } from "~~/server/models/greenhouse"
import { Actuator } from "~~/server/models/actuator"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"
import { ActuatorSchema } from "~~/shared/schema/actuator"

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

	// --- Trace greenhouseId
	const { ghname } = queryResult.data
    const gh = await Greenhouse.findOne({
        where: { name: ghname },
        attributes: ["id"],
    })

	if (!gh) {
		throw createError({
			statusCode: 400,
			statusMessage: "Greenhouse not found.",
		})
	}

	// --- Check permission first
	const permResult = await hasPermission(
		"Retrieve",
		"Actuator",
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

	// --- Find all of the greenhouse's actuators
    const actuators = await Actuator.findAll({
        include: [
            {
                model: Esp32,
                as: "esp32",
                where: { greenhouseId: gh.id },
                required: true,
                attributes: ["id"],
            },
        ],
    })
    
	return actuators.map((g) => ActuatorSchema.parse(g.dataValues))
})
