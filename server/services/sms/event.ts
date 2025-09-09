import { Peer } from "crossws"
import {
    WebSocketEventName,
    WebSocketEventQuery,
	WebSocketEventHandler,
    UserItem,
} from "./schema"

//

const listeners = new Map<
	WebSocketEventName,
	Set<[WebSocketEventQuery, WebSocketEventHandler]>
>()

//

const listen = (
    event: WebSocketEventName, 
    query: WebSocketEventQuery, 
    handler: WebSocketEventHandler
) => {
    const eset = listeners.get(event)
    if (eset) eset.add([query, handler])
    else listeners.set(event, new Set([[query, handler]]))
    console.info(`Sms listening on ${event}:${query}.`)
}

const unlisten = (
	event: WebSocketEventName,
	query: WebSocketEventQuery,
	handler: WebSocketEventHandler
) => {
    const eset = listeners.get(event)
    if (!eset) return
    for (const qh of eset) {
        if (qh[0] != query) continue
        if (qh[1] === handler) eset.delete(qh)
    }
}

//

const invoke = (
    peer: Peer, 
    user: UserItem, 
    data: any[], 
    event: WebSocketEventName, 
    query: WebSocketEventQuery
) => {
    const eset = listeners.get(event)
    if (!eset) return console.warn(`Sms ${event}:${query} invoked but no listener.`)
    
    for (const [q, h] of eset) {
        if (q != query) continue
        Promise.resolve()
            .then(async () => await h(peer, data, user))
            .catch(console.error)
    }
}

//

export default { listen, unlisten, invoke }
