import registry from "../registry";
import websocket from "../websocket";
import { Esp32Cam } from "~~/shared/schema/esp32-cam";

//

const update = (esp32Cam: Esp32Cam) => {
    for (const [p, e] of registry.esp32Cams) {
        if (e.id != esp32Cam.id) continue
        websocket.talk(p, [esp32Cam], "camera", "Update")
    }
}

//

export default { update }
