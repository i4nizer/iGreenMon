import z from "zod"
import { Token } from "~~/server/models/token"
import { Esp32Cam } from "~~/server/models/esp32-cam"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"

//

const QuerySchema = z.object({ esp32camid: z.coerce.number().int() })

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

	// --- Trace esp32 for the greenhouseId
	const { esp32camid } = queryResult.data
	const esp32 = await Esp32Cam.findOne({
		where: { id: esp32camid },
		attributes: ["tokenId", "greenhouseId"],
	})

	if (!esp32) {
		throw createError({
			statusCode: 400,
			statusMessage: "Esp32Cam not found.",
		})
	}

	// --- Check permission first
	const permResult = await hasPermission(
		"Retrieve",
		"Esp32Cam",
		userId,
		esp32.greenhouseId
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
    
    // --- Find the token
    const token = await Token.findOne({
        where: { id: esp32.tokenId },
        attributes: ["value"],
    })
    
    if (!token) {
        throw createError({
			statusCode: 400,
			statusMessage: "Token not found.",
		})
    }

    return token.dataValues.value
})