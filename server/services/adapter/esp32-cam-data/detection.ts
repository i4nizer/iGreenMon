import data from "../../data";
import esp32Cam from "../../esp32-cam";
import { Detection } from "~~/shared/schema/detection";

//

const onCreate = async (detection: Detection) => {
    await data.api.detection.create(detection).catch(console.error)
}

//

const init = () => {
    esp32Cam.hook.detection.onCreate(onCreate)
}

//

export default { init }
