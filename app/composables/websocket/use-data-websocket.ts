import {
	WebSocketEventName,
	WebSocketEventQuery,
	WebSocketEventSchema,
	type WebSocketEvent,
	type WebSocketEventHandler,
	type WebSocketEventListener,
} from "~/schema/websocket"

//

export const WebSocketStatus = [
	"CONNECTING",
	"OPEN",
	"CLOSING",
	"CLOSED",
] as const
export type WebSocketStatus = (typeof WebSocketStatus)[number]

//

export const useDataWebSocket = (
	url: string,
	opts?: {
		onOpen?: (ws: WebSocket) => any
		onMessage?: (ws: WebSocket, event: WebSocketEvent) => any
		onError?: (ws: WebSocket, event: Event) => any
		onClose?: (ws: WebSocket, event: CloseEvent) => any
	}
) => {
	// --- Data
	const status = ref<WebSocketStatus>(WebSocketStatus[0])
	const websocket = ref<WebSocket>()
	const listeners = reactive<WebSocketEventListener[]>([])

	// --- Utility
	const open = () => {
		websocket.value = new WebSocket(url)
		websocket.value.onopen = onOpenCallback
		websocket.value.onmessage = onMessageCallback
		websocket.value.onerror = onErrorCallback
		websocket.value.onclose = onCloseCallback
	}

	const send = (
		data: object[],
		event: WebSocketEventName,
		query: WebSocketEventQuery
	) => {
		if (!websocket.value) return
		websocket.value.binaryType = "blob"
		const wsevent: WebSocketEvent = { data, event, query }
		const payload = JSON.stringify(wsevent)
		websocket.value.send(payload)
	}

	const close = () => {
		if (!websocket.value) return
		websocket.value.close()
		websocket.value = undefined
		listeners.splice(0, listeners.length)
	}

	// --- Subs
	const listen = (
		event: WebSocketEventName, 
		query: WebSocketEventQuery, 
		handler: WebSocketEventHandler
	) => {
		listeners.push({ event, query, handler })
	}

	// --- Callbacks
	const onOpenCallback = (e: Event) => {
		if (!opts?.onOpen || !websocket.value) return
		status.value = WebSocketStatus[1]
		opts?.onOpen(websocket.value)
	}

	const onMessageCallback = (e: MessageEvent<string>) => {
		if (!websocket.value) return
		const msg = JSON.parse(e.data)
		const res = WebSocketEventSchema.safeParse(msg)
		if (!res.success) return
		if (opts?.onMessage) opts.onMessage(websocket.value, res.data)

		for (const l of listeners) {
			if (l.event != res.data.event) continue
			if (l.query != res.data.query) continue
			l.handler(websocket.value, res.data.data)
		}
	}

	const onErrorCallback = (e: Event) => {
		if (!opts?.onError || !websocket.value) return
		const state = websocket.value.readyState as 0 | 1 | 2 | 3
		status.value = WebSocketStatus[state]
		opts.onError(websocket.value, e)
	}

	const onCloseCallback = (e: CloseEvent) => {
		if (!opts?.onClose || !websocket.value) return
		status.value = WebSocketStatus[3]
		opts.onClose(websocket.value, e)
	}

	// --- Expose
	return { websocket, open, send, close, listen }
}
