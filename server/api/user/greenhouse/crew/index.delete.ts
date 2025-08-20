import { z } from "zod"
import { Crew } from "~~/server/models/crew"
import { Greenhouse } from "~~/server/models/greenhouse"
import { User } from "~~/server/models/user"
import { queueEmail } from "~~/server/services/email"

//

const QuerySchema = z.object({ crewid: z.string().min(1) })
const CrewSchema = z.object({
	id: z.number().int(),
	user: z.object({
		name: z.string(),
		email: z.string(),
	}),
	greenhouse: z.object({
		name: z.string(),
		user: z.object({ name: z.string() }),
	}),
})

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

	// --- Find and delete crew
	const userId = event.context.accessTokenPayload.id
	const { crewid } = qResult.data

	const crew = await Crew.findOne({
		where: { id: crewid },
		include: [
			{
				model: User,
				as: "user",
				required: true,
				foreignKey: "userId",
				attributes: ["name", "email"],
			},
			{
				model: Greenhouse,
				as: "greenhouse",
				where: { userId },
				required: true,
				foreignKey: "greenhouseId",
				attributes: ["name"],
				include: [
					{
						model: User,
						as: "user",
						required: true,
						foreignKey: "userId",
						attributes: ["name"],
					},
				],
			},
		],
		attributes: ["id"],
	})

	// --- Invalid
	if (!crew) {
		throw createError({
			statusCode: 404,
			statusMessage: "Greenhouse not found.",
		})
	}

	// --- Delete
	const crewVal = CrewSchema.parse(crew.dataValues)
	await crew.destroy()

	// --- Craft removal email
	const template = await useTemplate({
		type: "Crew-Removal-Notif",
		data: {
			crew: crewVal.user.name,
			owner: crewVal.greenhouse.user.name,
			greenhouse: crewVal.greenhouse.name,
		},
	})

	// --- Send email
	queueEmail(
		crewVal.user.email,
		"Crew Removal Notification - iGreenMon",
		undefined,
		template
	)

	return sendNoContent(event)
})
