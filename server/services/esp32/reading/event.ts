import { SensorReadPhase } from "#shared/schema/sensor"
import { ReadingEventListener, SensorItem } from "./schema"

//

// --- Registry
const listeners = new Map<SensorReadPhase, ReadingEventListener[]>([
	["Off", []],
	["Before", []],
	["During", []],
	["After", []],
])

//

const listen = (
    readphase: SensorReadPhase,
    listener: ReadingEventListener,
) => {
	const value = listeners.get(readphase)
    if (value) value.push(listener)
    else listeners.set(readphase, [listener])
    console.info(`Reading::Listening to sensor ${readphase} change.`)
}

const unlisten = (
	readphase: SensorReadPhase,
    listener: ReadingEventListener,
) => {
	const value = listeners.get(readphase)
    if (!value) return

	const idx = value.findIndex((l) => l === listener)
    if (idx != -1) value.splice(idx, 1)

    console.info(`Reading::Stopped listening to sensor ${readphase} change.`)
}

const invoke = (
    id: string,
    sensor: SensorItem,
    readphase: SensorReadPhase,
) => {
	const value = listeners.get(readphase)
    if (!value) return
    console.info(`Reading::Sensor ${sensor.name} invoked ${readphase} change.`)
    
    for (const listener of value) {
        Promise.resolve()
            .then(() => listener(id, sensor))
            .catch(console.error)
    }
}

//

export default { listen, unlisten, invoke }
