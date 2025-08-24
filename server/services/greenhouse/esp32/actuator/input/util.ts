import { InferAttributes } from "sequelize"
import { Esp32 } from "~~/server/models/esp32"
import { Actuator } from "~~/server/models/actuator"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"
import { PermissionType } from "~~/shared/schema/permission"

//

const hasInputPermission = async (
    type: PermissionType,
    actuatorId: number,
    userId: number
): Promise<SafeResult<boolean>> => {
	try {
		// --- Use actuator to trace esp32 for greenhouseId
		const actuator = await Actuator.findOne({
			where: { id: actuatorId },
			include: [
				{
					model: Esp32,
					as: "esp32",
					required: true,
					attributes: ["greenhouseId"],
				},
			],
			attributes: ["id"],
		}) 

		if (!actuator) return { success: false, error: "Actuator not found." }

		// --- Cast
		const actuatorValues = actuator.dataValues as unknown as Pick<
			InferAttributes<Actuator>,
			"id"
		> & { esp32: { greenhouseId: number } }

		// --- Check permission
		const permResult = await hasPermission(
			type,
			"Input",
			userId,
			actuatorValues.esp32.greenhouseId
		)
		if (!permResult.success) return permResult

        // --- return state
		return { success: true, data: permResult.data }
	} catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

//

export { hasInputPermission }