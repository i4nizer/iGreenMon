import { z } from "zod"
import { Esp32Cam } from "~~/server/models/esp32-cam"
import { Detection } from "~~/server/models/detection"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"
import { Capture } from "~~/server/models/capture"
import { Op } from "sequelize"

//

const QuerySchema = z.object({
	alpha: z.coerce.date().optional(),
	omega: z.coerce.date().optional(),
	limit: z.coerce.number().int().optional().default(30),
	offset: z.coerce.number().int().optional().default(0),
	esp32camid: z.coerce.number().int(),
})

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

	// --- Trace esp32cam for the greenhouseId
	const { esp32camid } = queryResult.data
	const esp32Cam = await Esp32Cam.findOne({
        where: { id: esp32camid },
		attributes: ["greenhouseId"],
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
		"Detection",
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
    
    // --- Craft filter
    const { alpha, omega, limit, offset } = queryResult.data
    const filter: any = {}

    if (alpha && omega) filter.createdAt = { [Op.gte]: alpha, [Op.lte]: omega }
    else if (alpha) filter.createdAt = { [Op.gte]: alpha }
    else if (omega) filter.createdAt = { [Op.lte]: omega }

	// --- Provide all of the esp32Cam's detections
	const detections = await Detection.findAll({
		where: filter,
		order: [["createdAt", "DESC"]],
		limit,
		offset,
		include: [
			{
				model: Capture,
				as: "capture",
				where: { esp32CamId: esp32camid },
				required: true,
				attributes: ["id"],
			},
		],
	})

	return detections.map((g) => g.dataValues)
})
