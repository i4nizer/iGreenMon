import { Sensor } from "~~/server/models/sensor";
import { SensorCreate, SensorUpdate } from "~~/shared/schema/sensor";
import { hasSensorPermission } from "./util";
import esp32 from "~~/server/services/esp32";

//

/**
 * - Checks Sensor:Create permission.
 * - Creates the sensor.
 */
const createSensor = async (
    data: SensorCreate,
    userId: number
): Promise<SafeResult<Sensor>> => {
    try {
        // --- Check permission
        const permResult = await hasSensorPermission(
            "Create",
            data.esp32Id,
            userId
        )

        if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
        }
        
        // --- Create and return the sensor
		const sensor = await Sensor.create({ ...data })
		
		// --- Send to websocket
		esp32.api.sensor.create(sensor)

        return { success: true, data: sensor }
    } catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Checks Sensor:Retrieve permission.
 * - Retrieves the sensor.
 */
const retrieveSensor = async (
    id: number,
    userId: number
): Promise<SafeResult<Sensor>> => {
    try {
		// --- Find sensor
		const sensor = await Sensor.findByPk(id)
		if (!sensor) return { success: false, error: "Sensor not found." }

		// --- Check permission
		const permResult = await hasSensorPermission(
			"Retrieve",
			sensor.esp32Id,
			userId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
        }
        
        // --- return sensor
        return { success: true, data: sensor }
	} catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Checks Sensor:Update permission.
 * - Updates the sensor.
 */
const updateSensor = async (
    data: SensorUpdate,
    userId: number
): Promise<SafeResult<Sensor>> => {
    try {
		// --- Find sensor
		const sensor = await Sensor.findByPk(data.id)
		if (!sensor) return { success: false, error: "Sensor not found." }

		// --- Check permission
		const permResult = await hasSensorPermission(
			"Update",
			sensor.esp32Id,
			userId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// --- Update and return sensor
		const { name, description, interval, disabled } = data
		await sensor.update({ name, description, interval, disabled })

		// --- Send to websocket
		esp32.api.sensor.update(sensor)

		return { success: true, data: sensor }
	} catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

/**
 * - Checks Sensor:Delete permission.
 * - Deletes the sensor.
 */
const deleteSensor = async (id: number, userId: number): Promise<SafeResult> => {
    try {
		// --- Find sensor
		const sensor = await Sensor.findOne({
			where: { id },
			attributes: ["id", "esp32Id"],
		})
		if (!sensor) return { success: false, error: "Sensor not found." }

		// --- Check permission
		const permResult = await hasSensorPermission(
			"Update",
			sensor.esp32Id,
			userId
		)

		if (!permResult.success) return permResult
		if (!permResult.data) {
			return {
				success: false,
				error: "User doesn't have permission.",
			}
		}

		// --- delete and return
		await sensor.destroy()

		// --- Send to websocket
		esp32.api.sensor.destroy(sensor)

		return { success: true, data: undefined }
	} catch (error) {
        console.error(error)
		return { success: false, error: "Something went wrong." }
    }
}

//

export { createSensor, retrieveSensor, updateSensor, deleteSensor }