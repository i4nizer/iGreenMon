import { z } from "zod"
import { Actuator } from "~~/server/models/actuator"
import { Input } from "~~/server/models/input"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"
import { Esp32 } from "~~/server/models/esp32"
import { InferAttributes } from "sequelize"

//

const QuerySchema = z.object({ actuatorid: z.coerce.number().int() })

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

	// --- Use actuator to trace esp32 for the greenhouseId
	const { actuatorid } = queryResult.data
	const actuator = await Actuator.findOne({
		where: { id: actuatorid },
		include: [
			{
				model: Esp32,
				as: "esp32",
				required: true,
				attributes: ["greenhouseId"],
			},
		],
		attributes: ["id"],
	})

	if (!actuator) {
		throw createError({
			statusCode: 400,
			statusMessage: "Actuator not found.",
		})
	}

	// --- Cast
	const actuatorValues = actuator.dataValues as unknown as Pick<
		InferAttributes<Actuator>,
		"id"
	> & { esp32: { greenhouseId: number } }

	// --- Check permission first
	const permResult = await hasPermission(
		"Retrieve",
		"Input",
		userId,
		actuatorValues.esp32.greenhouseId
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

	// --- Provide all of the actuator's inputs
	const inputs = await Input.findAll({ where: { actuatorId: actuator.id } })
	return inputs.map((g) => g.dataValues)
})
