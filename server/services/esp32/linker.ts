import action from "./action"
import reading from "./reading"
import threshold from "./threshold"
import { HookEventListener } from "./reading/schema"
import { ActionEventListener } from "./action/schema"
import { Action as ActionModel } from "~~/server/models/action"
import { ThresholdEventListener } from "./threshold/schema"
import { ScheduleEventListener } from "./schedule/schema"
import schedule from "./schedule"

//

// --- Invokes actions
const onQueueHook: HookEventListener = async (sid, hid) => {
	const promises = []

	for (const [id, set] of reading.registry.hooks) {
		if (id != sid) continue
		for (const hook of set) {
			if (hook.id != hid) continue
			promises.push(ActionModel.findByPk(hook.actionId))
		}
	}

	const actions = await Promise.all(promises)
	for (const a of actions) {
		if (!a) continue
		action.invoker.invoke(a)
	}
}

// --- Dequeues hooks on reading
const onUpdateAction: ActionEventListener = (action) => {
	for (const [sid, set] of reading.registry.hooks) {
		for (const hook of set) {
			if (hook.actionId != action.id) continue
			reading.hook.dequeue(hook.id)
		}
	}
}

// --- Invokes actions
const onActivateThreshold: ThresholdEventListener = async (
	pid,
	threshold,
	changed
) => {
    if (!threshold.activated || threshold.disabled) return
    const actions = await ActionModel.findAll({
        where: { thresholdId: threshold.id }
    })
    actions.forEach((a) => action.invoker.invoke(a.dataValues))
}

// --- Invokes actions reference such schedule
const onTriggerSchedule: ScheduleEventListener = async (pid, schedule) => {
	if (schedule.disabled) return
	const actions = await ActionModel.findAll({
		where: { scheduleId: schedule.id },
	})
	actions.forEach((a) => action.invoker.invoke(a.dataValues))
}

//

const init = () => {
	action.event.listen("Discarded", onUpdateAction)
	action.event.listen("Inactive", onUpdateAction)
	action.event.listen("Interrupted", onUpdateAction)
	action.event.listen("Timeout", onUpdateAction)

    reading.hook.listen("Queue", onQueueHook)
    
	threshold.event.listen("Activate", onActivateThreshold)
	
	schedule.event.listen(onTriggerSchedule)

	console.info(`Esp32 linker event listeners initialized.`)
}

//

export default { init }
