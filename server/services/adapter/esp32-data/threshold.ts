import data from "../../data"
import esp32 from "../../esp32"
import { Threshold } from "~~/shared/schema/threshold"

//

const onUpdate = async (threshold: Threshold) => {
	await data.api.threshold.update(threshold).catch(console.error)
}

//

const init = () => {
	esp32.hook.threshold.onUpdate(onUpdate)
}

//

export default { init }
