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
	captureid: z.coerce.number().int(),
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

	// --- Trace capture for the greenhouseId
	const { captureid } = queryResult.data
	const capture = await Capture.findOne({
        where: { id: captureid },
        include: [
            {
                model: Esp32Cam,
                as: "esp32Cam",
                required: true,
                attributes: ["greenhouseId"],
            },
        ],
		attributes: ["id"],
	})

	if (!capture) {
		throw createError({
			statusCode: 400,
			statusMessage: "Capture not found.",
		})
	}

	// --- Check permission first
	const permResult = await hasPermission(
		"Retrieve",
		"Detection",
		userId,
		(capture as any)?.esp32Cam?.greenhouseId
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
		where: {
			...filter,
			captureId: captureid,
		},
		order: [["createdAt", "DESC"]],
		limit,
		offset,
	})

	return detections.map((g) => g.dataValues)
})
