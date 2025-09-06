import * as schema from "./schema"

//

// --- Hook Queue
const hooks = new Map<number, Set<number>>() // Sensor.id => (Hook.id)[]
const timer = new Map<number, number>() // Hook.id => timequeued

//

const queue = (sid: number, hid: number) => {
	const hook = hooks.get(sid)
	if (hook) hook.add(hid)
	else hooks.set(sid, new Set([hid]))

    console.info(`Reading queued sensor ${sid} hook ${hid}.`)
	timer.set(hid, Date.now())
	invoke("Queue", sid, hid)
}

const dequeue = (hid: number) => {
	for (const [sid, set] of hooks.entries()) {
		set.delete(hid)
		timer.delete(hid)

        console.info(`Reading dequeued sensor ${sid} hook ${hid}.`)
		if (set.size <= 0) hooks.delete(sid)
		invoke("Dequeue", sid, hid)
	}
}

const timeout = (hid: number) => {
	for (const [sid, set] of hooks.entries()) {
		set.delete(hid)
		timer.delete(hid)

        console.info(`Reading timedout sensor ${sid} hook ${hid}.`)
		if (set.size <= 0) hooks.delete(sid)
		invoke("Timeout", sid, hid)
	}
}

//

// --- Listeners
const listeners = new Map<schema.HookEventName, Set<schema.HookEventListener>>([
	["Queue", new Set()],
	["Dequeue", new Set()],
	["Timeout", new Set()],
])

//

const listen = (
	event: schema.HookEventName,
	listener: schema.HookEventListener
) => {
	const item = listeners.get(event)
	if (item) item.add(listener)
    else listeners.set(event, new Set([listener]))
    console.info(`Reading listening to hook ${event} event.`)
}

const unlisten = (listener: schema.HookEventListener) => {
	for (const [event, set] of listeners) {
        set.delete(listener)
        console.info(`Reading stopped listening to hook ${event} event.`)
	}
}

const invoke = (event: schema.HookEventName, sid: number, hid: number) => {
    const item = listeners.get(event)
    console.info(`Reading sensor ${sid} called ${event} hook ${hid}.`)
	if (!item) return

	for (const listener of item) {
		Promise.resolve()
			.then(() => listener(sid, hid))
			.catch(console.error)
	}
}

//

// --- Does logic for timeout
const loop = () => {
	for (const [hid, birth] of timer) {
		const now = Date.now()
		const dead = now - birth > 15000
		if (dead) timeout(hid)
	}
}

//

export default { hooks, queue, dequeue, listen, unlisten, loop }
