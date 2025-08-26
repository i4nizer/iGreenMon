import { InferAttributes } from "sequelize"
import { Esp32 } from "~~/server/models/esp32"
import { Output } from "~~/server/models/output"
import { Sensor } from "~~/server/models/sensor"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"
import { PermissionType } from "~~/shared/schema/permission"

//

const hasReadingPermission = async (
    type: PermissionType,
    outputId: number,
    userId: number
): Promise<SafeResult<boolean>> => {
	try {
		// --- Use output to trace esp32 for greenhouseId
		const output = await Sensor.findOne({
			where: { id: outputId },
			include: [
				{
					model: Sensor,
					as: "sensor",
					required: true,
					attributes: ["id"],
					include: [
						{
							model: Esp32,
							as: "esp32",
							required: true,
							attributes: ["greenhouseId"],
						},
					],
				},
			],
			attributes: ["id"],
		}) 

		if (!output) return { success: false, error: "Output not found." }

		// --- Cast
		const outputValues = output.dataValues as unknown as Pick<
			InferAttributes<Output>,
			"id"
		> & { sensor: { esp32: { greenhouseId: number } } }

		// --- Check permission
		const permResult = await hasPermission(
			type,
			"Reading",
			userId,
			outputValues.sensor.esp32.greenhouseId
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

export { hasReadingPermission }