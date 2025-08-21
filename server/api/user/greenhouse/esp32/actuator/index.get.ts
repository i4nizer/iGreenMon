import { z } from "zod"
import { Esp32 } from "~~/server/models/esp32"
import { Actuator } from "~~/server/models/actuator"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"

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
		attributes: ["id", "greenhouseId"],
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
		"Actuator",
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

	// --- Provide all of the esp32's actuators
	const actuators = await Actuator.findAll({ where: { esp32Id: esp32.id } })
	return actuators.map((g) => g.dataValues)
})
