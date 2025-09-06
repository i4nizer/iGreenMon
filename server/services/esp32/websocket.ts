import event from "./event"
import registry from "./registry"
import { Peer, Message } from "crossws"
import {
	WebSocketEvent,
	WebSocketEventName,
	WebSocketEventQuery,
	WebSocketEventSchema,
} from "./schema"

//

// --- Event from esp32 to system
const hear = (peer: Peer, message: Message) => {
	const esp32 = registry.esp32s.get(peer)
	if (!esp32) return

	const msg = message.json<WebSocketEvent>()
	const res = WebSocketEventSchema.safeParse(msg)
	if (!res.success) return console.warn(`Esp32 websocket received invalid message.`, msg)

    const e = res.data
	console.info(`Esp32 websocket received ${e.query}:${e.event} from ws ${peer.id}.`)
	event.invoke(peer, e)
}

// --- Event from system to esp32
const talk = (
	pid: string,
	data: any[],
	event: WebSocketEventName,
	query: WebSocketEventQuery
) => {
	const payload = JSON.stringify({ data, event, query })
	for (const [p, e] of registry.esp32s) {
		if (p.id != pid) continue
		p.send(payload)
		console.info(`Esp32 websocket sent ${query}:${event} to ${e.name}.`)
	}
}

//

export default { hear, talk }
