import { Peer, Message } from "crossws"
import { WebSocketEventName, WebSocketEventQuery, WebSocketEventSchema } from "./schema"
import registry from "./registry"
import event from "./event"

//

// --- Receives event from websocket
const hear = (peer: Peer, message: Message) => {
	const msg = message.text()
	const res = WebSocketEventSchema.safeParse(msg)
	if (!res.success) return console.warn(`Data websocket received invalid message.`, msg)

	const e = res.data
	const user = registry.users.get(peer.id)
	
	if (!user) return console.info(`Data websocket received ${e.query}:${e.event} from ws ${peer.id}.`)
	else console.info(`Data websocket received ${e.query}:${e.event} from ${user.name}.`)
	
	event.invoke(peer, e.data, e.event, e.query)
}

// --- Sends event to the websocket
const talk = (
	pid: string,
	data: any[],
	event: WebSocketEventName,
	query: WebSocketEventQuery
) => {
	const peer = registry.peers.get(pid)
	if (!peer) return
	
	const payload = JSON.stringify({ data, event, query })
	for (const [p, user] of registry.users) {
		if (p != pid) continue
		peer.send(payload)
		console.info(`Data websocket sent ${event}:${query} to ${user.name}.`)
	}
}

//

export default { hear, talk }
