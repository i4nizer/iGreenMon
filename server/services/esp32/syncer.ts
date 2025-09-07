import event from "./event"
import action from "./action"
import reading from "./reading"
import threshold from "./threshold"
import { ActionItem } from "./action/schema"
import { SensorItem } from "./reading/schema"
import { SensorReadPhase } from "~~/shared/schema/sensor"
import { Input, InputSchema } from "~~/shared/schema/input"
import { Input as InputModel} from "~~/server/models/input"
import { Sensor as SensorModel } from "~~/server/models/sensor"
import { Action as ActionModel } from "~~/server/models/action"
import { Reading as ReadingModel } from "~~/server/models/reading"
import { Condition as ConditionModel } from "~~/server/models/condition"
import { Threshold as ThresholdModel } from "~~/server/models/threshold"
import { ReadingCreate, ReadingCreateSchema } from "~~/shared/schema/reading"
import { WebSocketEventHandler, WebSocketEventListener } from "./schema"
import { ConditionEventListener, ThresholdEventListener } from "./threshold/schema"

//

// --- Sensor update -> to db
const onUpdateSensor = (readphase: SensorReadPhase) => {
    return async (id: string, sensor: Readonly<SensorItem>) => {
        const { id: sid, lastread } = sensor
        await SensorModel.update(
            { lastread, readphase },
            { where: { id: sid } },
        )
    }
}

// --- Saves readings
const onCreateReading: WebSocketEventHandler<ReadingCreate> = async (
	peer,
	data,
	esp32
) => {
    const readings = []
	for (const r of data) {
		const res = ReadingCreateSchema.safeParse(r)
		if (!res.success) continue
		readings.push(res.data)
    }
    await ReadingModel.bulkCreate(readings)
}

// --- Updates inputs
const onUpdateInput: WebSocketEventHandler<
	Pick<Input, "id" | "flag" | "status">
> = async (peer, data, esp32) => {
	const schema = InputSchema.pick({ id: true, flag: true, status: true })
    const promises = []
	
    for (const i of data) {
		const res = schema.safeParse(i)
		if (!res.success) continue
        
        const promise = InputModel.update(
            { status: res.data.status },
            { where: { id: res.data.id } },
        )
        promises.push(promise)
    }
    
    await Promise.all(promises)
}

// --- Updates action
const onUpdateAction = async (action: Readonly<ActionItem>) => {
	const { id, status } = action
	await ActionModel.update({ status }, { where: { id } })
}

// --- Updates condition state in db
const onEvalCondition: ConditionEventListener = async (
    condition,
    changed
) => {
    if (!changed) return
    const { id, satisfied } = condition
    await ConditionModel.update({ satisfied }, { where: { id } })
}

// --- Updates threshold state in db
const onEvalThreshold: ThresholdEventListener = async (
    pid,
    threshold,
    changed
) => {
    if (!changed) return
    const { id, activated } = threshold
    await ThresholdModel.update({ activated }, { where: { id } })
}

//

const init = () => {
    reading.event.listen("Off", onUpdateSensor("Off"))
    reading.event.listen("Before", onUpdateSensor("Before"))
    reading.event.listen("During", onUpdateSensor("During"))
    reading.event.listen("After", onUpdateSensor("After"))

    action.event.listen("Active", onUpdateAction)
	action.event.listen("Delayed", onUpdateAction)
	action.event.listen("Discarded", onUpdateAction)
	action.event.listen("Inactive", onUpdateAction)
	action.event.listen("Interrupted", onUpdateAction)
    action.event.listen("Timeout", onUpdateAction)
    
    threshold.event.listen("Activate", onEvalThreshold)
    threshold.event.listen("Deactivate", onEvalThreshold)
    threshold.condition.listen("Satisfied", onEvalCondition)
    threshold.condition.listen("Desatisfied", onEvalCondition)

    const listeners: WebSocketEventListener[] = [
        { event: "reading", query: "Create", handler: onCreateReading },
        { event: "input", query: "Update", handler: onUpdateInput },
    ]
    listeners.forEach((l) => event.listen(l))

    console.info(`Esp32 syncer event listeners initialized.`)
}

//

export default { init }