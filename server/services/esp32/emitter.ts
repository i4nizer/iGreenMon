import reading from "./reading"
import websocket from "./websocket"
import type { ActionEventListener } from "./action/schema"
import type { ReadingEventListener } from "./reading/schema"
import type { WebSocketEventName, WebSocketEventQuery } from "./schema"
import { Action as ActionModel } from "~~/server/models/action"
import { Input as InputModel } from "~~/server/models/input"
import { Actuator as ActuatorModel } from "~~/server/models/actuator"
import { Esp32 as Esp32Model } from "~~/server/models/esp32"
import registry from "./registry"
import action from "./action"

//

// --- Emits reading's readphase during to retrieve readings
const onUpdateReadingPhaseDuring: ReadingEventListener = (id, sensor) => {
	const data = [{ id: sensor.id }]
	const event: WebSocketEventName = "reading"
	const query: WebSocketEventQuery = "Retrieve"
	websocket.talk(id, data, event, query)
}

// --- Emits action's status
const onUpdateActionStatus: ActionEventListener = async (action) => {
	// --- Trace esp32Id
	const { id, status } = action
	const ares = await ActionModel.findOne({
		where: { id },
		attributes: ["id"],
		include: [
			{
				model: InputModel,
				as: "input",
				required: true,
				attributes: ["id"],
				include: [
					{
						model: ActuatorModel,
						as: "actuator",
						required: true,
						attributes: ["id", "esp32Id"],
					},
				],
			},
		],
	})

	// --- Craft payload
	const data = [{ id, status }]
	const event: WebSocketEventName = "action"
	const query: WebSocketEventQuery = "Update"
	
	// --- Send to the responsible esp32 websocket
	const esp32Id = (ares as any).input.actuator.esp32Id as number
	for (const [p, e] of registry.esp32s) {
		if (e.id != esp32Id) continue
		websocket.talk(p.id, data, event, query)
	}
}

//

const init = () => {
	reading.event.listen("During", onUpdateReadingPhaseDuring)
	action.event.listen("Active", onUpdateActionStatus)
	action.event.listen("Timeout", onUpdateActionStatus)
	console.info("Esp32::Emitter listening on readingphase during change.")
}

//

export default { init }
