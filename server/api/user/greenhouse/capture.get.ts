import { z } from "zod"
import { Esp32Cam } from "~~/server/models/esp32-cam"
import { Capture } from "~~/server/models/capture"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"
import { Greenhouse } from "~~/server/models/greenhouse"
import { CaptureSchema } from "~~/shared/schema/capture"

//

const QuerySchema = z.object({ ghname: z.string().min(1) })

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

	// --- Trace greenhouseId
	const { ghname } = queryResult.data
    const gh = await Greenhouse.findOne({
        where: { name: ghname },
        attributes: ["id"],
    })

	if (!gh) {
		throw createError({
			statusCode: 400,
			statusMessage: "Greenhouse not found.",
		})
	}

	// --- Check permission first
	const permResult = await hasPermission(
		"Retrieve",
		"Capture",
		userId,
		gh.id
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
        include: [
            {
                model: Esp32Cam,
                as: "esp32Cam",
                where: { greenhouseId: gh.id },
                required: true,
                attributes: ["id"],
            },
        ],
	})

	return captures.map((g) => CaptureSchema.parse(g.dataValues))
})
