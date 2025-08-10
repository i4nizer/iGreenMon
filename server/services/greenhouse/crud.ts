import { Greenhouse } from "~~/server/models/greenhouse"
import { isGHNameAvailable } from "./util"

//

/**
 * - Checks the availability of the greenhouse name first.
 * - If name is available, greenhouse is created and returned.
 */
const createGH = async (
	data: GreenhouseCreate,
	userId: number
): Promise<SafeResult<Greenhouse>> => {
	try {
		// --- Check availability of greenhouse name
		const nameCheckResult = await isGHNameAvailable(data.name, userId)
		if (!nameCheckResult.success) return nameCheckResult

		// --- Create and provide greenhouse
		const greenhouse = await Greenhouse.create({ ...data, userId })
		return { success: true, data: greenhouse }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Queries greenhouse by name.
 */
const retrieveGH = async (
	name: string,
	userId: number
): Promise<SafeResult<Greenhouse>> => {
	try {
		const gh = await Greenhouse.findOne({ where: { name, userId } })
		if (!gh) return { success: false, error: "Greenhouse not found." }
		return { success: true, data: gh }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Checks the availability of the new greenhouse name first.
 * - If new name is available, greenhouse is updated and returned.
 */
const updateGH = async (
	data: GreenhouseUpdate,
	userId: number
): Promise<SafeResult<Greenhouse>> => {
	try {
		// --- Check availability of greenhouse name
		const { id, name, description } = data
		const nameCheckResult = await isGHNameAvailable(name, userId, id)
		if (!nameCheckResult.success) return nameCheckResult

		// --- Find greenhouse
		const gh = await Greenhouse.findOne({ where: { id, userId } })
		if (!gh) return { success: false, error: "Greenhouse not found." }

		// --- Provide greenhouse
		return { success: true, data: gh }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

/**
 * - Greenhouse is deleted and count is returned.
 */
const deleteGH = async (
	name: string,
	userId: number
): Promise<SafeResult<number>> => {
	try {
		// --- Count deletion for state
		const count = await Greenhouse.destroy({ where: { name, userId } })
		return { success: true, data: count }
	} catch (error) {
		console.error(error)
		return { success: false, error: "Something went wrong." }
	}
}

//

export { createGH, retrieveGH, updateGH, deleteGH }