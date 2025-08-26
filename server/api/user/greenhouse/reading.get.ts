import { Op } from "sequelize"
import { z } from "zod"
import { Esp32 } from "~~/server/models/esp32"
import { Greenhouse } from "~~/server/models/greenhouse"
import { Output } from "~~/server/models/output"
import { Reading } from "~~/server/models/reading"
import { Sensor } from "~~/server/models/sensor"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"
import { ReadingSchema } from "~~/shared/schema/reading"

//

const QuerySchema = z.object({
    alpha: z.coerce.date().optional(),
    omega: z.coerce.date().optional(),
    limit: z.coerce.number().int().optional().default(30),
    offset: z.coerce.number().int().optional().default(0),
    ghname: z.string().min(1),
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

	// --- Trace greenhouseId
	const { ghname } = queryResult.data
	const userId = event.context.accessTokenPayload.id

	const gh = await Greenhouse.findOne({
		where: { name: ghname },
		attributes: ["id"],
	})

	if (!gh) {
		throw createError({
			statusCode: 404,
			statusMessage: "Greenhouse not found.",
		})
	}

	// --- Check permission
	const permResult = await hasPermission("Retrieve", "Reading", userId, gh.id)

	if (!permResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: permResult.error,
		})
	}

	// --- Craft filter
	const { alpha, omega, limit, offset } = queryResult.data
	const filter: any = {}

	if (alpha && omega) filter.createdAt = { [Op.gte]: alpha, [Op.lte]: omega }
	else if (alpha) filter.createdAt = { [Op.gte]: alpha }
	else if (omega) filter.createdAt = { [Op.lte]: omega }

	// --- Find outputs
	const outputs = await Output.findAll({
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
						where: { greenhouseId: gh.id },
						required: true,
						attributes: ["id"],
					},
				],
			},
		],
		attributes: ["id"],
	})

	// --- Now find (limit) readings per output
	const promises = outputs.map(async (o) => {
		const readings = await Reading.findAll({
			where: { ...filter, outputId: o.id },
			order: [["createdAt", "DESC"]],
			limit,
			offset,
		})
		return readings.map((r) => ReadingSchema.parse(r))
	})

    const readings = await Promise.all(promises)
	return readings.flat()
})