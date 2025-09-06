import registry from "../registry";
import websocket from "../websocket";
import { Actuator } from "~~/shared/schema/actuator";

//

const create = (actuator: Actuator) => {
    for (const [peer, esp32] of registry.esp32s) {
        if (esp32.id != actuator.esp32Id) continue
        websocket.talk(peer.id, [actuator], "actuator", "Create")
    }
}

const update = (actuator: Actuator) => {
    for (const [peer, esp32] of registry.esp32s) {
		if (esp32.id != actuator.esp32Id) continue
		websocket.talk(peer.id, [actuator], "actuator", "Update")
	}
}

const destroy = (actuator: Pick<Actuator, "id" | "esp32Id">) => {
    for (const [peer, esp32] of registry.esp32s) {
		if (esp32.id != actuator.esp32Id) continue
		websocket.talk(peer.id, [actuator], "actuator", "Delete")
	}
}

//

export default { create, update, destroy }
