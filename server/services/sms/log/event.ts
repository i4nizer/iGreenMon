import { LogEventListener, LogEventName } from "./schema"

//

const listeners = new Map<LogEventName, Set<LogEventListener>>()

//

const listen = (event: LogEventName, listener: LogEventListener) => {
	const lset = listeners.get(event)
	if (lset) lset.add(listener)
	else listeners.set(event, new Set([listener]))
}

const unlisten = (event: LogEventName, listener: LogEventListener) => {
	const lset = listeners.get(event)
	if (lset) lset.delete(listener)
}

//

const invoke = (event: LogEventName, uid: number, lid: number) => {
	const lset = listeners.get(event)
	if (!lset) return console.info(`Log invoked ${event} for log ${lid}.`)

	for (const listener of lset) {
		Promise.resolve()
			.then(async () => await listener(uid, lid))
			.catch(console.error)
	}
}

//

export default { listen, unlisten, invoke }
