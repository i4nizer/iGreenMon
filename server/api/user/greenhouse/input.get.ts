import { z } from "zod"
import { Input } from "~~/server/models/input"
import { Greenhouse } from "~~/server/models/greenhouse"
import { InputSchema } from "~~/shared/schema/input"
import { Actuator } from "~~/server/models/actuator"
import { Esp32 } from "~~/server/models/esp32"

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

    // --- Find all greenhouse's inputs
    const userId = event.context.accessTokenPayload.id
	const { ghname } = qResult.data
	const inputs = await Input.findAll({
		include: [
            {
                model: Actuator,
                as: "actuator",
                required: true,
                attributes: ["id"],
                include: [
                    {
                        model: Esp32,
                        as: "esp32",
                        required: true,
                        attributes: ["id"],
                        include: [
                            {
                                model: Greenhouse,
                                as: "greenhouse",
                                where: { name: ghname, userId },
                                required: true,
                                attributes: ["id"],
                            },
                        ],
                    },
                ],
            },
		],
	})

	// --- Provide the inputs
	return inputs.map((c) => InputSchema.parse(c.dataValues))
})
