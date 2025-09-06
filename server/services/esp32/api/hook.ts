import reading from "../reading";
import { Hook } from "~~/shared/schema/hook";
import { Sensor as SensorModel } from "~~/server/models/sensor"
import registry from "../registry";
import websocket from "../websocket";

//

const create = async (hook: Hook) => {
    for (const [sid, set] of reading.registry.hooks) {
        if (sid != hook.sensorId) continue
        set.add(hook)
    }

    const sensor = await SensorModel.findOne({
        where: { id: hook.sensorId },
        attributes: ["esp32Id"],
    })
    if (!sensor) return console.warn(`Esp32 api hook created, sensor not found.`)
    
    for (const [peer, esp32] of registry.esp32s) {
        if (esp32.id != sensor.esp32Id) continue
        websocket.talk(peer.id, [hook], "hook", "Create")
    }
}

const update = async (hook: Hook) => {
    for (const [sid, set] of reading.registry.hooks) {
        if (sid != hook.sensorId) continue
        for (const hk of set) {
            if (hk.id != hook.id) continue
            hk.type = hook.type
            hk.actionId = hook.actionId
        }
    }

    const sensor = await SensorModel.findOne({
        where: { id: hook.sensorId },
        attributes: ["esp32Id"],
    })
    if (!sensor) return console.warn(`Esp32 api hook created, sensor not found.`)
    
    for (const [peer, esp32] of registry.esp32s) {
        if (esp32.id != sensor.esp32Id) continue
        websocket.talk(peer.id, [hook], "hook", "Update")
    }
}

const destroy = async (hook: Pick<Hook, "id" | "sensorId">) => {
    for (const [sid, set] of reading.registry.hooks) {
        if (sid != hook.sensorId) continue
        for (const hk of set) {
            if (hk.id != hook.id) continue
            set.delete(hk)
        }
    }
    
    const sensor = await SensorModel.findOne({
        where: { id: hook.sensorId },
        attributes: ["esp32Id"],
    })
    if (!sensor) return console.warn(`Esp32 api hook created, sensor not found.`)
    
    for (const [peer, esp32] of registry.esp32s) {
        if (esp32.id != sensor.esp32Id) continue
        websocket.talk(peer.id, [hook], "hook", "Delete")
    }
}

//

export default { create, update, destroy }
