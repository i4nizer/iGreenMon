import data from "../../data"
import esp32 from "../../esp32"
import { Reading } from "~~/shared/schema/reading"

//

const onCreate = async (reading: Reading) => {
    await data.api.reading.create(reading).catch(console.error)
}

//

const init = () => {
    esp32.hook.reading.onCreate(onCreate)
}

//

export default { init }
