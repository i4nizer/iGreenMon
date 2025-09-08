import data from "../../data";
import esp32Cam from "../../esp32-cam";
import { Capture } from "~~/shared/schema/capture";

//

const onCreate = async (capture: Capture) => {
    await data.api.capture.create(capture).catch(console.error)
}

//

const init = () => {
    esp32Cam.hook.capture.onCreate(onCreate)
}

//

export default { init }
