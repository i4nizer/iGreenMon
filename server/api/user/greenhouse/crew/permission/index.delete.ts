import { revokePermission } from "~~/server/services/greenhouse/crew/permission"
import { PermissionRevokeSchema } from "~~/shared/schema/permission"

//

export default defineEventHandler(async (event) => {
	// --- Validate data
	const body = await readBody(event)
	const bodyResult = PermissionRevokeSchema.safeParse(body)

	if (!bodyResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: bodyResult.error.message,
		})
	}

	// --- Pass revoking to perm service
	const userId = event.context.accessTokenPayload.id
	const permRevoke = bodyResult.data
	const revokeResult = await revokePermission(permRevoke, userId)

	if (!revokeResult.success) {
		throw createError({
			statusCode: 400,
			statusMessage: revokeResult.error,
		})
	}

	// --- return nothing really
	return sendNoContent(event)
})
