import z from "zod"
import { HookSchema } from "~~/shared/schema/hook"
import { SensorSchema } from "~~/shared/schema/sensor"

//

// --- Sensor
const SensorItemSchema = SensorSchema.pick({
	id: true,
	name: true,
	interval: true,
	lastread: true,
    readphase: true,
	esp32Id: true,
    disabled: true,
})

type SensorItem = z.infer<typeof SensorItemSchema>

//

// --- Hook
const HookItemSchema = HookSchema.pick({
    id: true,
    type: true,
    sensorId: true,
    actionId: true,
})

type HookItem = z.infer<typeof HookItemSchema>

// --- Hook Event
type HookEventName = "Queue" | "Dequeue" | "Timeout"
type HookEventListener = (sid: number, hid: number) => any

// --- Output Event
type OutputEventName = "Queue" | "Dequeue" | "Timeout"
type OutputEventListener = (sid: number, oid: number) => any

//

// --- Reading Event
type ReadingEvent = {
	id: string
	sensor: Readonly<SensorItem>
}

type ReadingEventListener = (
	id: string,
	sensor: Readonly<SensorItem>,
) => any

//

export {
	SensorItemSchema,
	HookItemSchema,
}

export type {
    SensorItem, 
    HookItem, 
    HookEventName,
    HookEventListener,
    OutputEventName,
    OutputEventListener,
    ReadingEvent, 
    ReadingEventListener,
}
