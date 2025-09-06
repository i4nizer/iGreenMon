import {
	ThresholdEventName,
	ThresholdEventListener,
	ThresholdItem,
} from "./schema"

//

// --- Registry
const listeners = new Map<ThresholdEventName, Set<ThresholdEventListener>>([
	["Activate", new Set()],
	["Deactivate", new Set()],
])

//

const listen = (
	event: ThresholdEventName,
	listener: ThresholdEventListener
) => {
	const item = listeners.get(event)
	if (item) item.add(listener)
	else listeners.set(event, new Set([listener]))
	console.info(`Threshold listening to threshold ${event} change.`)
}

const unlisten = (
	event: ThresholdEventName,
	listener: ThresholdEventListener
) => {
	const item = listeners.get(event)
	if (!item) return
	item.delete(listener)
	console.info(`Threshold stopped listening to threshold ${event} change.`)
}

const invoke = (
	pid: string,
	threshold: ThresholdItem,
	event: ThresholdEventName,
	changed: boolean
) => {
	const item = listeners.get(event)
	if (!item) return
	threshold.activated = event === "Activate"
	console.info(`Threshold ${threshold.name} invoked ${event} change.`)

	for (const listener of item) {
		Promise.resolve()
			.then(() => listener(pid, threshold, changed))
			.catch(console.error)
	}
}

//

export default { listen, unlisten, invoke }
