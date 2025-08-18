import { Greenhouse } from "~~/server/models/greenhouse"
import { isGHNameAvailable } from "./util"
import { Op } from "sequelize"
import { Crew } from "~~/server/models/crew"
import { GreenhouseCreate, GreenhouseUpdate } from "~~/shared/schema/greenhouse"

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
		// --- Find crew instances of the user
		const crews = await Crew.findAll({
			where: { userId },
			attributes: ["greenhouseId"],
		})

		// --- Find greenhouse including from crew instances
		const ghIds = crews.map((c) => c.greenhouseId)
		const gh = await Greenhouse.findOne({
			where: {
				[Op.or]: [
					{ name, userId },
					{ id: { [Op.in]: ghIds }, name },
				],
			},
		})

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

		// --- Update greenhouse
		await gh.update({ name, description })

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