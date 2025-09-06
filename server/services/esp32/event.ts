import registry from "./registry"
import { Peer } from "crossws"
import { WebSocketEvent, WebSocketEventListener } from "./schema"

//

// --- Event listening
const listeners: WebSocketEventListener[] = []

const listen = (listener: WebSocketEventListener) => listeners.push(listener)

const unlisten = (listener: WebSocketEventListener) => {
	const idx = listeners.findIndex((l) => l === listener)
	if (idx != -1) listeners.splice(idx, 1)
}

const invoke = (peer: Peer, wse: WebSocketEvent) => {
	for (const l of listeners) {
		const match = l.event == wse.event && l.query == wse.query
        if (!match) continue
        
		const esp32 = registry.esp32s.get(peer)
        if (!esp32) {
            console.warn(`Esp32 event ${wse.event} received without esp32.`)
            continue
        }
		
        Promise.resolve()
            .then(() => l.handler(peer, wse.data, esp32))
            .catch(console.error)
	}
}

//

export default { listen, unlisten, invoke }
