import z from "zod"

//

const WebSocketEventName = [
	"power",
	"esp32",
	"pin",
	"sensor",
	"output",
	"hook",
	"reading",
	"actuator",
	"input",
	"action",
	"condition",
	"schedule",
	"threshold",
	"capture",
	"detection",
	"log",
] as const
type WebSocketEventName = (typeof WebSocketEventName)[number]

const WebSocketEventQuery = ["Create", "Retrieve", "Update", "Delete"] as const
type WebSocketEventQuery = (typeof WebSocketEventQuery)[number]

//

const WebSocketEventSchema = z.object({
	data: z.array(z.record(z.any())).default([]),
	event: z.enum(WebSocketEventName),
	query: z.enum(WebSocketEventQuery),
})

//

type WebSocketEvent = z.infer<typeof WebSocketEventSchema>

type WebSocketEventListener = {
	event: WebSocketEventName
	query: WebSocketEventQuery
	handler: WebSocketEventHandler<any>
}

type WebSocketEventHandler<T = any> = (ws: WebSocket, data: T[]) => any

//

export { WebSocketEventName, WebSocketEventQuery, WebSocketEventSchema }

export type { WebSocketEvent, WebSocketEventListener, WebSocketEventHandler }
