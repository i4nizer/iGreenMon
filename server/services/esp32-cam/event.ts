import { Peer } from "crossws"
import { Esp32Cam } from "~~/shared/schema/esp32-cam"
import { WebSocketEventHandler } from "./schema"

//

// --- Event listening
const handlers: WebSocketEventHandler[] = []

//

const listen = (handler: WebSocketEventHandler) => handlers.push(handler)

const unlisten = (handler: WebSocketEventHandler) => {
	const idx = handlers.findIndex((l) => l === handler)
	if (idx != -1) handlers.splice(idx, 1)
}

//

const invoke = (
    peer: Peer, 
    image: ArrayBuffer | SharedArrayBuffer, 
    esp32Cam: Esp32Cam
) => {
	for (const h of handlers) {
		Promise.resolve()
			.then(() => h(peer, image, esp32Cam))
			.catch(console.error)
	}
}

//

export default { listen, unlisten, invoke }
