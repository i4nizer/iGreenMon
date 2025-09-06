import { Hook as HookModel } from "~~/server/models/hook"
import { Output as OutputModel } from "~~/server/models/output"
import {
	type HookItem,
	type SensorItem,
	HookItemSchema,
	SensorItemSchema,
} from "./schema"

//

// --- Registry
const sensors = new Map<string, Set<SensorItem>>() // Peer.id   => SensorItem[]
const outputs = new Map<number, Set<number>>() // Sensor.id => (Output.id)[]
const hooks = new Map<number, Set<HookItem>>() // Sensor.id => (Hook.id)[]

//

const register = async (id: string, sensor: any) => {
	// --- Parse sensor
	const sres = SensorItemSchema.safeParse(sensor)
	if (!sres.success) return

	// --- Set sensor
	const sitem = sensors.get(id)
	if (sitem) sitem.add(sres.data)
	else sensors.set(id, new Set([sres.data]))

	// --- Set outputs
	const ores = await OutputModel.findAll({
		where: { sensorId: sres.data.id },
		attributes: ["id"],
	})

	const oitem = outputs.get(sres.data.id)
	if (oitem) ores.forEach((o) => oitem.add(o.id))
	else outputs.set(sres.data.id, new Set(ores.map((o) => o.id)))

	// --- Set hooks
	const hres = await HookModel.findAll({
		where: { sensorId: sres.data.id },
		attributes: ["id", "type", "sensorId", "actionId"],
	})

	const hitem = hooks.get(sres.data.id)
	const hdata = hres
		.map((h) => HookItemSchema.safeParse(h))
		.filter((h) => h.success)
		.map((h) => h.data)

	if (hitem) hdata.forEach((h) => hitem.add(h))
    else hooks.set(sres.data.id, new Set(hdata))
    
    console.info(`Reading::Sensor ${sensor.name} registered.`)
}

const unregister = (id: string) => {
	const sitem = sensors.get(id)
	if (sitem) sitem.forEach((s) => outputs.delete(s.id))
    sensors.delete(id)
    if (sitem) console.info(`Reading::Esp32 unregistered ${sitem.size} sensors.`)
}

//

export default { sensors, outputs, hooks, register, unregister }
