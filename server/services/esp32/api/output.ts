import reading from "../reading";
import registry from "../registry";
import websocket from "../websocket";
import { Output } from "~~/shared/schema/output";
import { Sensor as SensorModel } from "~~/server/models/sensor";

//

const create = async (output: Output) => {
    const set = reading.registry.outputs.get(output.sensorId)
    if (set) set.add(output.id)
    
    const sensor = await SensorModel.findOne({
        where: { id: output.sensorId },
        attributes: ["esp32Id"],
    })
    if (!sensor) return console.warn(`Esp32 output created, sensor not found.`)
    
    for (const [peer, esp32] of registry.esp32s) {
        if (esp32.id != sensor.esp32Id) continue
        websocket.talk(peer.id, [output], "output", "Create")
    }
}

const update = async (output: Output) => {
    const sensor = await SensorModel.findOne({
		where: { id: output.sensorId },
		attributes: ["esp32Id"],
	})
	if (!sensor) return console.warn(`Esp32 output updated, sensor not found.`)

	for (const [peer, esp32] of registry.esp32s) {
		if (esp32.id != sensor.esp32Id) continue
		websocket.talk(peer.id, [output], "output", "Update")
	}
}

const destroy = async (output: Pick<Output, "id" | "sensorId">) => {
    const set = reading.registry.outputs.get(output.sensorId)
    if (set) set.delete(output.id)
    reading.output.dequeue(output.id)
    
    const sensor = await SensorModel.findOne({
		where: { id: output.sensorId },
		attributes: ["esp32Id"],
	})
	if (!sensor) return console.warn(`Esp32 output created, sensor not found.`)

	for (const [peer, esp32] of registry.esp32s) {
		if (esp32.id != sensor.esp32Id) continue
		websocket.talk(peer.id, [output], "output", "Delete")
	}
}

//

export default { create, update, destroy }
