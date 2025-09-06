import * as schema from "./schema"
import { ActionStatus } from "~~/shared/schema/action"

//

// --- Listeners
const listeners = new Map<ActionStatus, Set<schema.ActionEventListener>>([
	["Inactive", new Set()],
	["Delayed", new Set()],
	["Active", new Set()],
	["Discarded", new Set()],
	["Interrupted", new Set()],
	["Timeout", new Set()],
])

//

const listen = (
	status: ActionStatus,
	listener: schema.ActionEventListener
) => {
	const item = listeners.get(status)
	if (item) item.add(listener)
	else listeners.set(status, new Set([listener]))
	console.info(`Action listening to action ${status} status.`)
}

const unlisten = (listener: schema.ActionEventListener) => {
	for (const [event, set] of listeners) {
		set.delete(listener)
		console.info(`Action stopped listening to action ${event} event.`)
	}
}

//

const invoke = (status: ActionStatus, action: schema.ActionItem) => {
	const item = listeners.get(status)
	action.status = status
	console.info(`Action ${action.name} moved to ${status}.`)
	if (!item) return

	for (const listener of item) {
		Promise.resolve()
			.then(() => listener(action))
			.catch(console.error)
	}
}

//

export default { listen, unlisten, invoke }
