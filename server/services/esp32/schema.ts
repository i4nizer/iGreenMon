import z from "zod";
import { Peer } from "crossws"
import type { Esp32 } from "#shared/schema/esp32";

//

const WebSocketEventName = [
	"auth",
	"error",
	"token",
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
] as const
type WebSocketEventName = (typeof WebSocketEventName)[number]

const WebSocketEventQuery = [
    "Create",
    "Retrieve",
    "Update",
    "Delete",
] as const
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

type WebSocketEventHandler<T = any> = (
    peer: Peer,
    data: T[],
    esp32: Esp32
) => any;

//

export { WebSocketEventName, WebSocketEventQuery, WebSocketEventSchema }

export type {
	WebSocketEvent,
	WebSocketEventListener,
	WebSocketEventHandler,
}
