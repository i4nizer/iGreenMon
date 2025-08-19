import { Op } from "sequelize"
import { Greenhouse } from "~~/server/models/greenhouse"

//

/** @returns true if available otherwise false */
const isGHNameAvailable = async (
    name: string,
    userId: number,
    exceptId?: number
): Promise<SafeResult<boolean>> => {
    try {
        const where = exceptId
            ? { id: { [Op.ne]: exceptId }, name, userId }
            : { name, userId }
        const count = await Greenhouse.count({ where, attributes: ["id"] })
        return { success: true, data: count <= 0 }
    } catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

//

export { isGHNameAvailable }