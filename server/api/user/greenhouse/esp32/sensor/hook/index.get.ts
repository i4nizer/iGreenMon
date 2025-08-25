import { z } from "zod"
import { Sensor } from "~~/server/models/sensor"
import { Hook } from "~~/server/models/hook"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"
import { Esp32 } from "~~/server/models/esp32"
import { InferAttributes } from "sequelize"

//

const QuerySchema = z.object({ sensorid: z.coerce.number().int() })

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

	// --- Use sensor to trace esp32 for the greenhouseId
	const { sensorid } = queryResult.data
	const sensor = await Sensor.findOne({
		where: { id: sensorid },
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

	if (!sensor) {
		throw createError({
			statusCode: 400,
			statusMessage: "Sensor not found.",
		})
	}

	// --- Cast
	const sensorValues = sensor.dataValues as unknown as Pick<
		InferAttributes<Sensor>,
		"id"
	> & { esp32: { greenhouseId: number } }

	// --- Check permission first
	const permResult = await hasPermission(
		"Retrieve",
		"Hook",
		userId,
		sensorValues.esp32.greenhouseId
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

	// --- Provide all of the sensor's hooks
	const hooks = await Hook.findAll({ where: { sensorId: sensor.id } })
	return hooks.map((g) => g.dataValues)
})
