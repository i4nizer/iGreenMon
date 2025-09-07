import registry from "./registry"
import { Peer } from "crossws"
import {
	WebSocketEventName,
	WebSocketEventQuery,
	WebSocketEventListener,
} from "./schema"

//

// --- Event listening
const listeners: WebSocketEventListener[] = []

//

const listen = (listener: WebSocketEventListener) => listeners.push(listener)

const unlisten = (listener: WebSocketEventListener) => {
	const idx = listeners.findIndex((l) => l === listener)
	if (idx != -1) listeners.splice(idx, 1)
}

//

const invoke = (
	peer: Peer,
	data: any[],
	event: WebSocketEventName,
	query: WebSocketEventQuery
) => {
	for (const l of listeners) {
		const match = l.event == event && l.query == query
		if (!match) continue

		const user = registry.users.get(peer.id)
		if (!user) {
			console.warn(`Data event ${event} received without user.`)
			continue
		}

		if (user.disabled || !user.verified) continue
		Promise.resolve()
			.then(() => l.handler(peer, data, user))
			.catch(console.error)
	}
}

//

export default { listen, unlisten, invoke }
