import event from "./event"
import registry from "./registry"
import { Peer, Message } from "crossws"
import { WebSocketEventName, WebSocketEventQuery } from "./schema"

//

const hear = async (peer: Peer, message: Message) => {
    const image = message.arrayBuffer()
    for (const [p, e] of registry.esp32Cams) {
        if (p != peer.id) continue
        event.invoke(peer, image, e)
        console.info(`Esp32Cam websocket received image.`)
    }
}

const talk = async (
    pid: string,
    data: any[],
    event: WebSocketEventName,
    query: WebSocketEventQuery
) => {
    const payload = JSON.stringify({ data, event, query })
    for (const [p, e] of registry.esp32Cams) {
        if (pid != p) continue
        const peer = registry.peers.get(pid)
        if (!peer) continue
        peer.send(payload)
        console.info(`Esp32Cam websocket sent ${event}:${query}.`)
    }
}

//

export default { hear, talk }
