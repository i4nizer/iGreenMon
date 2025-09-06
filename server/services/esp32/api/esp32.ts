import registry from "../registry";
import { Esp32 } from "#shared/schema/esp32";
import websocket from "../websocket";

//

const destroy = (esp32: Pick<Esp32, "id">) => {
    for (const [p, e] of registry.esp32s) {
        if (esp32.id != e.id) continue
        registry.unregister(p)
        p.close()
    }
}

//

const restart = (esp32: Pick<Esp32, "id">) => {
    for (const [p, e] of registry.esp32s) {
        if (esp32.id != e.id) continue
        websocket.talk(p.id, [], "power", "Delete")
	}
}

//

export default { destroy, restart }
