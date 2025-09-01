import { z } from "zod"
import { Log } from "~~/server/models/log"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"
import { Greenhouse } from "~~/server/models/greenhouse"
import { LogSchema } from "~~/shared/schema/log"
import { Op } from "sequelize"

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
		"Log",
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

	// --- Craft filter
	const { alpha, omega, limit, offset } = queryResult.data
	const filter: any = {}

	if (alpha && omega) filter.createdAt = { [Op.gte]: alpha, [Op.lte]: omega }
	else if (alpha) filter.createdAt = { [Op.gte]: alpha }
	else if (omega) filter.createdAt = { [Op.lte]: omega }

	// --- Provide all of the greenhouse's logs
	const logs = await Log.findAll({
		where: { ...filter },
		include: [
			{
				model: Greenhouse,
				as: "greenhouse",
				where: { id: gh.id },
				required: true,
				attributes: ["id"],
			},
		],
		order: [["createdAt", "DESC"]],
		limit,
		offset,
	})

	return logs.map((g) => LogSchema.parse(g.dataValues))
})
