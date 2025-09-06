import * as schema from "./schema"

//

// --- Output Queue
const timer = new Map<number, number>() // Output.id => timequeued
const outputs = new Map<number, Set<number>>() // Sensor.id => (Output.id)[]

//

const queue = (sid: number, oid: number) => {
    const output = outputs.get(sid)
    if (output) output.add(oid)
    else outputs.set(sid, new Set([oid]))

    console.info(`Reading queued sensor ${sid} output ${oid}.`)
    timer.set(oid, Date.now())
    invoke("Queue", sid, oid)
}

const dequeue = (oid: number) => {
    for (const [sid, set] of outputs.entries()) {
        set.delete(oid)
        timer.delete(oid)

        console.info(`Reading dequeued sensor ${sid} output ${oid}.`)
        if (set.size <= 0) outputs.delete(sid)
        invoke("Dequeue", sid, oid)
    }
}

const timeout = (oid: number) => {
    for (const [sid, set] of outputs.entries()) {
        set.delete(oid)
        timer.delete(oid)

        console.info(`Reading timedout sensor ${sid} output ${oid}.`)
        if (set.size <= 0) outputs.delete(sid)
        invoke("Timeout", sid, oid)
    }
}

//

// --- Listeners
const listeners = new Map<schema.OutputEventName, Set<schema.OutputEventListener>>([
    ["Queue", new Set()],
    ["Dequeue", new Set()],
    ["Timeout", new Set()],
])

//

const listen = (
    event: schema.OutputEventName,
    listener: schema.OutputEventListener
) => {
    const item = listeners.get(event)
    if (item) item.add(listener)
    else listeners.set(event, new Set([listener]))
    console.info(`Reading listening to hook ${event} event.`)
}

const unlisten = (listener: schema.OutputEventListener) => {
    for (const [event, set] of listeners) {
        set.delete(listener)
        console.info(`Reading stopped listening to hook ${event} event.`)
    }
}

const invoke = (event: schema.OutputEventName, sid: number, oid: number) => {
    const item = listeners.get(event)
    console.info(`Reading sensor ${sid} called ${event} output ${oid}.`)
    if (!item) return
    
    for (const listener of item) {
		Promise.resolve()
			.then(() => listener(sid, oid))
			.catch(console.error)
	}
}

//

// --- Does logic for timeout
const loop = () => {
    for (const [oid, birth] of timer) {
        const now = Date.now()
        const dead = now - birth > 15000
        if (dead) timeout(oid)
    }
}

//

export default { outputs, queue, dequeue, listen, unlisten, loop }
