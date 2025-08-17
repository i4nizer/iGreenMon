import { grantPermission } from "~~/server/services/greenhouse/crew/permission"
import { PermissionGrantSchema } from "~~/shared/schema/permission"

//

export default defineEventHandler(async (event) => {
	// --- Validate data
	const body = await readBody(event)
	const bodyResult = PermissionGrantSchema.safeParse(body)

	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: bodyResult.error.message,
		})
	}

	// --- Pass granting to the perm service
	const userId = event.context.accessTokenPayload.id
	const grantResult = await grantPermission(bodyResult.data, userId)

	if (!grantResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: grantResult.error,
		})
	}

	// --- return the perm
	return grantResult.data.dataValues
})
