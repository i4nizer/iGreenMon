import z from "zod"
import { Peer } from "crossws"

//

const WebSocketEventName = [
	"auth",
	"error",
	"token",
	"power",
	"log",
	"sms",
] as const
type WebSocketEventName = (typeof WebSocketEventName)[number]

const WebSocketEventQuery = ["Create", "Retrieve", "Update", "Delete"] as const
type WebSocketEventQuery = (typeof WebSocketEventQuery)[number]

const WebSocketEventSchema = z.object({
	data: z.array(z.record(z.any())).default([]),
	event: z.enum(WebSocketEventName),
	query: z.enum(WebSocketEventQuery),
})

type WebSocketEventHandler<T = any> = (
	peer: Peer,
	data: T[],
	user: UserItem
) => any

//

type UserItem = {
	id: number
	name: string
	phone: string
}

//

export {
	WebSocketEventName,
	WebSocketEventQuery,
	WebSocketEventHandler,
	WebSocketEventSchema,
}

export type { UserItem }
