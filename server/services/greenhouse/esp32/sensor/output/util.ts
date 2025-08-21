import { InferAttributes } from "sequelize"
import { Esp32 } from "~~/server/models/esp32"
import { Sensor } from "~~/server/models/sensor"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"
import { PermissionType } from "~~/shared/schema/permission"

//

const hasOutputPermission = async (
    type: PermissionType,
    sensorId: number,
    userId: number
): Promise<SafeResult<boolean>> => {
	try {
		// --- Use sensor to trace esp32 for greenhouseId
		const sensor = await Sensor.findOne({
			where: { id: sensorId },
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

		if (!sensor) return { success: false, error: "Sensor not found." }

		// --- Cast
		const sensorValues = sensor.dataValues as unknown as Pick<
			InferAttributes<Sensor>,
			"id"
		> & { esp32: { greenhouseId: number } }

		// --- Check permission
		const permResult = await hasPermission(
			type,
			"Output",
			userId,
			sensorValues.esp32.greenhouseId
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

export { hasOutputPermission }