import hook from "./hook"
import event from "./event"
import output from "./output"
import registry from "./registry"
import { HookType } from "~~/shared/schema/hook"
import { SensorItem } from "./schema"

//

const fish = (sid: number, type: HookType) => {
    const hooks = registry.hooks.get(sid)
	if (!hooks) return

	for (const h of hooks) {
		if (h.type != type) continue
		hook.queue(sid, h.id)
	}
}

//

const prep = (id: string, sensor: SensorItem) => {
    const isReadTime = Date.now() - sensor.lastread > sensor.interval
	if (!isReadTime) return

    console.info(`Reading sensor ${sensor.name} is now in Before readphase.`)
    fish(sensor.id, "Before")
	sensor.readphase = "Before"
	event.invoke(id, sensor, "Before")
}

const read = (id: string, sensor: SensorItem) => {
    const set = hook.hooks.has(sensor.id)
    if (set) return

    console.info(`Reading sensor ${sensor.name} is now in During readphase.`)
    fish(sensor.id, "During")
    const outputs = registry.outputs.get(sensor.id)
    if (outputs) outputs.forEach((oid) => output.queue(sensor.id, oid))

    sensor.readphase = "During"
    event.invoke(id, sensor, "During")
}

const pack = (id: string, sensor: SensorItem) => {
    const hset = hook.hooks.has(sensor.id)
    const oset = output.outputs.has(sensor.id)
	if (hset || oset) return

    console.info(`Reading sensor ${sensor.name} is now in After readphase.`)
	fish(sensor.id, "After")
    sensor.lastread = Date.now()
    sensor.readphase = "After"
	event.invoke(id, sensor, "After")
}

const stop = (id: string, sensor: SensorItem) => {
    const set = hook.hooks.has(sensor.id)
	if (set) return

	sensor.readphase = "Off"
    event.invoke(id, sensor, "Off")
    console.info(`Reading sensor ${sensor.name} is now in Off readphase.`)
}

//

const move = (id: string, sensor: SensorItem) => {
    // --- Off, Before, During After
    if (sensor.readphase == "Off") prep(id, sensor)

    // --- Before to During
    if (sensor.readphase == "Before") read(id, sensor)
    
    // --- During to After
    if (sensor.readphase == "During") pack(id, sensor)
    
    // --- After to Off
    if (sensor.readphase == "After") stop(id, sensor)
}

//

const loop = () => {
    for (const [id, set] of registry.sensors) {
        for (const sensor of set) {
            if (sensor.disabled) continue
            
            Promise.resolve()
                .then(() => move(id, sensor))
                .catch(console.error)
        }
    }
}

//

export default { loop }