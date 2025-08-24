import { z } from "zod"
import { Threshold } from "~~/server/models/threshold"
import { Condition } from "~~/server/models/condition"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"

//

const QuerySchema = z.object({ thresholdid: z.coerce.number().int() })

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

	// --- Trace threshold for the greenhouseId
	const { thresholdid } = queryResult.data
	const threshold = await Threshold.findOne({
		where: { id: thresholdid },
		attributes: ["id", "greenhouseId"],
	})

	if (!threshold) {
		throw createError({
			statusCode: 400,
			statusMessage: "Threshold not found.",
		})
	}

	// --- Check permission first
	const permResult = await hasPermission(
		"Retrieve",
		"Condition",
		userId,
		threshold.greenhouseId
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

	// --- Provide all of the threshold's conditions
	const conditions = await Condition.findAll({ where: { thresholdId: threshold.id } })
	return conditions.map((g) => g.dataValues)
})
