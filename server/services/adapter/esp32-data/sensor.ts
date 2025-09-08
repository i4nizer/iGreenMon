import data from "../../data"
import esp32 from "../../esp32"
import { Sensor } from "~~/shared/schema/sensor"

//

const onUpdate = async (sensor: Sensor) => {
	await data.api.sensor.update(sensor).catch(console.error)
}

//

const init = () => {
	esp32.hook.sensor.onUpdate(onUpdate)
}

//

export default { init }
