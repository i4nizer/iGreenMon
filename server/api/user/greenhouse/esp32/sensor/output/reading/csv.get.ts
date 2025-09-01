import { Op } from "sequelize"
import { z } from "zod"
import { Esp32 } from "~~/server/models/esp32"
import { Output } from "~~/server/models/output"
import { Reading } from "~~/server/models/reading"
import { Sensor } from "~~/server/models/sensor"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"
import { Readable } from "stream"

//

const QuerySchema = z.object({
    alpha: z.coerce.date().optional(),
    omega: z.coerce.date().optional(),
    limit: z.coerce.number().int().optional(),
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
		id: number
		sensor: {
			id: number
			esp32: { greenhouseId: number }
		}
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

	// --- Set stream headers
	setHeader(event, "Content-Type", "text/csv")
	setHeader(
		event,
		"Content-Disposition",
		`attachment; filename="readings.csv"`
	)

	// --- Create headers keys
	const keys = [
		"id",
		"name",
		"icon",
		"unit",
		"value",
		"outputId",
		"createdAt",
		"updatedAt",
	] as const
	const header = `${keys.join(",")}\n`

	// --- Count the total data
    const count = (await Reading.count({ where: filter })) - offset
    const empty = (!!limit && limit == 0) || count <= 0
	if (empty) return sendStream(event, Readable.from([header]))

	// --- Calculate iterations
	let skip = offset
	let sent = 0
	const batch = 50
	let headed = false

	// --- Create encoder helper
	const encoder = new TextEncoder()
	const encode = (str: string) => encoder.encode(str)

	// --- Craft iterator function
	const pull = async (ctrlr: ReadableStreamDefaultController) => {
		// --- Retrieve readings
		const rows = await Reading.findAll({
			where: { ...filter },
			order: [["createdAt", "DESC"]],
			limit: batch,
			offset: skip,
		})

		// --- Increment offset
		const slice = rows.slice(0, limit ? limit - sent : rows.length)
		skip += batch
		sent += slice.length

		// --- Send csv header
        if (!headed) {
            ctrlr.enqueue(encode(header))
            headed = true
        }

		// --- Send csv contents
		for (const row of slice) {
			const line = keys.map((k) => row.dataValues[k]).join(",")
			ctrlr.enqueue(encode(`${line}\n`))
		}

		// --- Escape condition
		const exceeded = !!limit && sent >= limit
		if (exceeded || slice.length <= 0) return ctrlr.close()
	}

	// --- Send stream
	const stream = new ReadableStream({ pull })
	return sendStream(event, stream)
})