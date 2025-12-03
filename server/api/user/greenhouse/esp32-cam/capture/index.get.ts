import { z } from "zod"
import { Esp32Cam } from "~~/server/models/esp32-cam"
import { Capture } from "~~/server/models/capture"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"
import { PaginationSchema } from "#shared/schema/pagination"
import { Op } from "sequelize"

//

const QuerySchema = PaginationSchema
	.partial()
	.merge(z.object({ esp32camid: z.coerce.number().int() }))

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

	// --- Trace esp32-cam for the greenhouseId
	const { esp32camid, alpha, omega, limit, offset } = queryResult.data
	const esp32Cam = await Esp32Cam.findOne({
		where: { id: esp32camid },
		attributes: ["id", "greenhouseId"],
	})

	if (!esp32Cam) {
		throw createError({
			statusCode: 400,
			statusMessage: "Esp32Cam not found.",
		})
	}

	// --- Check permission first
	const permResult = await hasPermission(
		"Retrieve",
		"Capture",
		userId,
		esp32Cam.greenhouseId
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

	// --- Provide all of the esp32Cam's captures
	const captures = await Capture.findAll({
		where: {
			esp32CamId: esp32Cam.id,
			...((alpha && omega) && { createdAt: { [Op.between]: [alpha, omega] } }),
		},
		...(limit && { limit }),
		...(offset && { offset }),
	})
	
	return captures.map((g) => g.dataValues)
})
