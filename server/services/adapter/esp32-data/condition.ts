import data from "../../data"
import esp32 from "../../esp32"
import { Condition } from "~~/shared/schema/condition"

//

const onUpdate = async (condition: Condition) => {
	await data.api.condition.update(condition).catch(console.error)
}

//

const init = () => {
	esp32.hook.condition.onUpdate(onUpdate)
}

//

export default { init }
