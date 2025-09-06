import {
	ConditionEventName,
	ConditionEventListener,
	ConditionItem,
} from "./schema"

//

// --- Registry
const listeners = new Map<ConditionEventName, Set<ConditionEventListener>>([
	["Satisfied", new Set()],
	["Desatisfied", new Set()],
])

//

const listen = (
	event: ConditionEventName,
	listener: ConditionEventListener
) => {
	const item = listeners.get(event)
	if (item) item.add(listener)
	else listeners.set(event, new Set([listener]))
	console.info(`Condition listening to condition ${event} change.`)
}

const unlisten = (
	event: ConditionEventName,
	listener: ConditionEventListener
) => {
	const item = listeners.get(event)
	if (!item) return
	item.delete(listener)
	console.info(`Condition stopped listening to condition ${event} change.`)
}

const invoke = (
	event: ConditionEventName,
	condition: ConditionItem,
	changed: boolean
) => {
	const item = listeners.get(event)
	if (!item) return
	condition.satisfied = event === "Satisfied"
	console.info(`Condition ${condition.id} invoked ${event} change.`)

	for (const listener of item) {
		Promise.resolve()
			.then(() => listener(condition, changed))
			.catch(console.error)
	}
}

//

export default { listen, unlisten, invoke }
