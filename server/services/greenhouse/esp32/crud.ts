import esp32Service from "~~/server/services/esp32"
import { Esp32Create, Esp32Update } from "#shared/schema/esp32"
import { Esp32 } from "~~/server/models/esp32"
import { Token } from "~~/server/models/token"
import { createToken } from "~~/server/services/token"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"

//

/**
 * - Checks for Esp32:Create permission.
 * - Creates esp32 and token.
 */
const createEsp32 = async (
	data: Esp32Create,
	userId: number
): Promise<SafeResult<Esp32>> => {
	try {
		// --- Check for permission
		const permResult = await hasPermission(
			"Create",
			"Esp32",
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
			type: "Esp32",
			value: "",
			userId,
		})

		// --- Create esp32 token
		const esp32 = await Esp32.create({
			...data,
			tokenId: token.id,
		})

		// --- Create real token value
		const esp32Token = createToken(
			{
				id: userId,
				esp32Id: esp32.id,
			},
			"Esp32"
		)

		// --- Update the dummy database token
		await token.update({ value: esp32Token })

		// --- return the esp32
		return { success: true, data: esp32 }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Checks for Esp32:Retrive permission.
 * - Finds the esp32.
 */
const retrieveEsp32 = async (
	id: number,
	userId: number
): Promise<SafeResult<Esp32>> => {
	try {
		// --- Find esp32
		const esp32 = await Esp32.findByPk(id)
		if (!esp32) return { success: false, error: "Esp32 not found." }

		// --- Check for permission
		const permResult = await hasPermission(
			"Retrieve",
			"Esp32",
			userId,
			esp32.greenhouseId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// --- passed, return it
		return { success: true, data: esp32 }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Checks Esp32:Update permission.
 * - Updates the esp32.
 */
const updateEsp32 = async (
	data: Esp32Update,
	userId: number
): Promise<SafeResult<Esp32>> => {
	try {
		// --- Find esp32
		const esp32 = await Esp32.findByPk(data.id)
		if (!esp32) return { success: false, error: "Esp32 not found." }

		// --- Check for permission
		const permResult = await hasPermission(
			"Update",
			"Esp32",
			userId,
			esp32.greenhouseId
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
		await esp32.update({ name, description })
		return { success: true, data: esp32 }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Checks Esp32:Delete permission.
 * - Deletes esp32.
 */
const deleteEsp32 = async (id: number, userId: number): Promise<SafeResult> => {
	try {
		// --- Find esp32
		const esp32 = await Esp32.findOne({
			where: { id },
			attributes: ["id", "greenhouseId"],
		})
		if (!esp32) return { success: false, error: "Esp32 not found." }

		// --- Check for permission
		const permResult = await hasPermission(
			"Delete",
			"Esp32",
			userId,
			esp32.greenhouseId
		)
		
		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// --- passed, delete it
		await esp32.destroy()

		// --- Send to websocket
		esp32Service.api.esp32.destroy(esp32)

		return { success: true, data: undefined }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

//

export { createEsp32, retrieveEsp32, updateEsp32, deleteEsp32 }
