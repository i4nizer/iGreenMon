import { z } from "zod"
import { Condition } from "~~/server/models/condition"
import { Threshold } from "~~/server/models/threshold"
import { Greenhouse } from "~~/server/models/greenhouse"
import { ConditionSchema } from "~~/shared/schema/condition"

//

const QuerySchema = z.object({ ghname: z.string().min(1) })

//

export default defineEventHandler(async (event) => {
	// --- Get greenhouse.name from query
	const query = getQuery(event)
	const qResult = QuerySchema.safeParse(query)

	if (!qResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: qResult.error.message,
		})
	}

	// --- Find all greenhouse's conditions
	const { ghname } = qResult.data
	const conditions = await Condition.findAll({
		include: [
			{
				model: Threshold,
				as: "threshold",
				required: true,
				foreignKey: "thresholdId",
				attributes: ["id"],
				include: [
					{
						model: Greenhouse,
						as: "greenhouse",
						where: { name: ghname },
						required: true,
						foreignKey: "greenhouseId",
						attributes: ["id"],
					},
				],
			},
		],
	})

	// --- Provide the conditions
	return conditions.map((c) => ConditionSchema.parse(c.dataValues))
})
