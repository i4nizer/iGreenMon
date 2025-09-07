import data from "../../data"
import esp32 from "../../esp32"
import { Action } from "~~/shared/schema/action"

//

const onUpdate = async (action: Action) => {
	await data.api.action.update(action).catch(console.error)
}

//

const init = () => {
	esp32.hook.action.onUpdate(onUpdate)
}

//

export default { init }
