import esp32CamService from "~~/server/services/esp32-cam"
import { Esp32CamCreate, Esp32CamUpdate } from "#shared/schema/esp32-cam"
import { Esp32Cam } from "~~/server/models/esp32-cam"
import { Token } from "~~/server/models/token"
import { createToken } from "~~/server/services/token"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"

//

/**
 * - Checks for Esp32Cam:Create permission.
 * - Creates esp32Cam and token.
 */
const createEsp32Cam = async (
	data: Esp32CamCreate,
	userId: number
): Promise<SafeResult<Esp32Cam>> => {
	try {
		// --- Check for permission
		const permResult = await hasPermission(
			"Create",
			"Esp32Cam",
			userId,
			data.greenhouseId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// --- Create dummy token
		const token = await Token.create({
			type: "Esp32Cam",
			value: "",
			userId,
		})

		// --- Create esp32Cam token
		const esp32Cam = await Esp32Cam.create({
			...data,
			tokenId: token.id,
		})

		// --- Create real token value
		const esp32CamToken = createToken(
			{
				id: userId,
				esp32CamId: esp32Cam.id,
			},
			"Esp32Cam"
		)

		// --- Update the dummy database token
		await token.update({ value: esp32CamToken })

		// --- return the esp32Cam
		return { success: true, data: esp32Cam }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Checks for Esp32Cam:Retrive permission.
 * - Finds the esp32Cam.
 */
const retrieveEsp32Cam = async (
	id: number,
	userId: number
): Promise<SafeResult<Esp32Cam>> => {
	try {
		// --- Find esp32Cam
		const esp32Cam = await Esp32Cam.findByPk(id)
		if (!esp32Cam) return { success: false, error: "Esp32Cam not found." }

		// --- Check for permission
		const permResult = await hasPermission(
			"Retrieve",
			"Esp32Cam",
			userId,
			esp32Cam.greenhouseId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// --- passed, return it
		return { success: true, data: esp32Cam }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Checks Esp32Cam:Update permission.
 * - Updates the esp32Cam.
 */
const updateEsp32Cam = async (
	data: Esp32CamUpdate,
	userId: number
): Promise<SafeResult<Esp32Cam>> => {
	try {
		// --- Find esp32Cam
		const esp32Cam = await Esp32Cam.findByPk(data.id)
		if (!esp32Cam) return { success: false, error: "Esp32Cam not found." }

		// --- Check for permission
		const permResult = await hasPermission(
			"Update",
			"Esp32Cam",
			userId,
			esp32Cam.greenhouseId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// passed, update and return it
		const { name, description } = data
		await esp32Cam.update({ name, description })

		// --- Send to websocket
		esp32CamService.api.esp32Cam.update(esp32Cam)

		return { success: true, data: esp32Cam }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Checks Esp32Cam:Delete permission.
 * - Deletes esp32Cam.
 */
const deleteEsp32Cam = async (id: number, userId: number): Promise<SafeResult> => {
	try {
		// --- Find esp32Cam
		const esp32Cam = await Esp32Cam.findOne({
			where: { id },
			attributes: ["id", "greenhouseId"],
		})
		if (!esp32Cam) return { success: false, error: "Esp32Cam not found." }

		// --- Check for permission
		const permResult = await hasPermission(
			"Delete",
			"Esp32Cam",
			userId,
			esp32Cam.greenhouseId
		)
		
		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// --- passed, delete it
		await esp32Cam.destroy()
		return { success: true, data: undefined }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

//

export { createEsp32Cam, retrieveEsp32Cam, updateEsp32Cam, deleteEsp32Cam }
