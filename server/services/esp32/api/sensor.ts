import reading from "../reading";
import registry from "../registry";
import websocket from "../websocket";
import { Sensor } from "~~/shared/schema/sensor";

//

const create = (sensor: Sensor) => {
    const promises = []
    for (const [peer, esp32] of registry.esp32s) {
        if (esp32.id != sensor.esp32Id) continue
        promises.push(reading.registry.register(peer.id, sensor))
        websocket.talk(peer.id, [sensor], "sensor", "Create")
    }
    Promise.all(promises).catch(console.error)
}

const update = (sensor: Sensor) => {
    for (const [pid, set] of reading.registry.sensors) {
        for (const s of set) {
            if (s.id != sensor.id) continue
            s.name = sensor.name
            s.interval = sensor.interval
            s.disabled = sensor.disabled
        }
    }

    for (const [peer, esp32] of registry.esp32s) {
        if (esp32.id != sensor.esp32Id) continue
        websocket.talk(peer.id, [sensor], "sensor", "Update")
    }
}

const destroy = (sensor: Pick<Sensor, "id" | "esp32Id">) => {
    for (const [peer, esp32] of registry.esp32s) {
        if (esp32.id != sensor.esp32Id) continue
        reading.registry.unregister(peer.id)
		websocket.talk(peer.id, [sensor], "sensor", "Delete")
	}
}

//

export default { create, update, destroy }
