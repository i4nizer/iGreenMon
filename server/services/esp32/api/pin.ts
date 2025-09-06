import registry from "../registry";
import websocket from "../websocket";
import { Pin } from "~~/shared/schema/pin";

//

const create = (pin: Pin) => {
    for (const [peer, esp32] of registry.esp32s) {
        if (esp32.id != pin.esp32Id) continue
        websocket.talk(peer.id, [pin], "pin", "Create")
    }
}

const update = (pin: Pin) => {
    for (const [peer, esp32] of registry.esp32s) {
		if (esp32.id != pin.esp32Id) continue
		websocket.talk(peer.id, [pin], "pin", "Update")
	}
}

const destroy = (pin: Pick<Pin, "id" | "esp32Id">) => {
    for (const [peer, esp32] of registry.esp32s) {
		if (esp32.id != pin.esp32Id) continue
		websocket.talk(peer.id, [pin], "pin", "Delete")
	}
}

//

export default { create, update, destroy }
