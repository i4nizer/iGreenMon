import type { DetectionBBox } from "#shared/schema/detection"

//

const WebSocketStatus = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"] as const
type WebSocketStatus = (typeof WebSocketStatus)[number]

//

export const useDetectionBBoxWebSocket = (
    url: string,
    opts?: {
        onOpen?: (ws: WebSocket) => any,
        onMessage?: (ws: WebSocket, bboxes: DetectionBBox[]) => any,
        onError?: (ws: WebSocket, event: Event) => any,
        onClose?: (ws: WebSocket, event: CloseEvent) => any,
    }
) => {
    // --- Data
    const status = ref<WebSocketStatus>(WebSocketStatus[0])
    const websocket = ref<WebSocket>()
    const detections = reactive<DetectionBBox[]>([])

    // --- Utility
    const open = () => {
        websocket.value = new WebSocket(url)
        websocket.value.onopen = onOpenCallback
        websocket.value.onmessage = onMessageCallback
        websocket.value.onerror = onErrorCallback
        websocket.value.onclose = onCloseCallback
    }

    const send = (image: ArrayBufferLike | Blob | ArrayBufferView) => {
		if (!websocket.value) return
		websocket.value.send(image)
    }
    
    const close = () => {
        if (!websocket.value) return
        websocket.value.close()
        websocket.value = undefined
    }

    // --- Callbacks
    const onOpenCallback = (e: Event) => {
        if (!opts?.onOpen || !websocket.value) return
		status.value = WebSocketStatus[1]
		opts?.onOpen(websocket.value)
    }

    const onMessageCallback = (e: MessageEvent<DetectionBBox[]>) => {
        if (!opts?.onMessage || !websocket.value) return
		detections.splice(0, detections.length)
		detections.push(...e.data)
		opts.onMessage(websocket.value, e.data)
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
    return { websocket, detections, open, send, close }
}