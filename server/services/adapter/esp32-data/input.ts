import data from "../../data"
import esp32 from "../../esp32"
import { Input } from "~~/shared/schema/input"

//

const onUpdate = async (input: Input) => {
	await data.api.input.update(input).catch(console.error)
}

//

const init = () => {
	esp32.hook.input.onUpdate(onUpdate)
}

//

export default { init }
