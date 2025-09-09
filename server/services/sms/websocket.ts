import event from "./event"
import registry from "./registry"
import { Peer, Message } from "crossws"
import {
    WebSocketEventName,
    WebSocketEventQuery,
    WebSocketEventSchema,
} from "./schema"

//

const hear = (peer: Peer, message: Message) => {
    const eres = WebSocketEventSchema.safeParse(message.json())
    if (!eres.success) return console.warn(`Sms received invalid message.`)
    
    const e = eres.data
    const user = registry.users.get(peer.id)
    if (!user) return console.warn(`Sms ${e.event}:${e.query} received but no user.`)
    
    console.info(`Sms received ${e.event}:${e.query} from ${peer.id}.`)
    event.invoke(peer, user, e.data, e.event, e.query)
}

const talk = (
    pid: string, 
    data: any[], 
    event: WebSocketEventName,
    query: WebSocketEventQuery
) => {
    const peer = registry.peers.get(pid)
    if (!peer) return console.warn(`Sms talk failed, peer ${pid} not found.`)
    
    const payload = JSON.stringify({ data, event, query })
    peer.send(payload)
    console.info(`Sms ${event}:${query} sent ${pid}.`)
}

//

export default { hear, talk }
