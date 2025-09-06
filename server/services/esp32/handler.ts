import event from "./event"
import websocket from "./websocket"
import type { WebSocketEventHandler, WebSocketEventListener } from "./schema"
import { Pin } from "~~/server/models/pin"
import { Sensor } from "~~/server/models/sensor"
import { Output } from "~~/server/models/output"
import { OutputSchema } from "~~/shared/schema/output"
import { Actuator } from "~~/server/models/actuator"
import { Input } from "~~/server/models/input"
import { InputSchema } from "~~/shared/schema/input"
import { Action } from "~~/server/models/action"

//

// --- Retrieve Requests
const onRetrievePin: WebSocketEventHandler = async (peer, data, esp32) => {
	const pins = await Pin.findAll({ where: { esp32Id: esp32.id } })
	websocket.talk(peer.id, pins.map((p) => p.dataValues), "pin", "Create")
	console.info("Esp32::Sending pins.")
}

const onRetrieveSensor: WebSocketEventHandler = async (peer, data, esp32) => {
	const sensors = await Sensor.findAll({ where: { esp32Id: esp32.id } })
	websocket.talk(peer.id, sensors.map((s) => s.dataValues), "sensor", "Create")
	console.info("Esp32::Sending sensors.")
}

const onRetrieveOutput: WebSocketEventHandler = async (peer, data, esp32) => {
	const outputs = await Output.findAll({
		include: [
			{
				model: Sensor,
				as: "sensor",
				where: { esp32Id: esp32.id },
				required: true,
				attributes: ["id"],
			},
		],
	})

	const omap = outputs.map((o) => OutputSchema.parse(o))
	websocket.talk(peer.id, omap, "output", "Create")
	console.info("Esp32::Sending outputs.")
}

const onRetrieveActuator: WebSocketEventHandler = async (peer, data, esp32) => {
	const actuators = await Actuator.findAll({ where: { esp32Id: esp32.id } })
	const amap = actuators.map((a) => a.dataValues)
	websocket.talk(peer.id, amap, "actuator", "Create")
	console.info("Esp32::Sending actuators.")
}

const onRetrieveInput: WebSocketEventHandler = async (peer, data, esp32) => {
	const inputs = await Input.findAll({
		include: [
			{
				model: Actuator,
				as: "actuator",
				where: { esp32Id: esp32.id },
				required: true,
				attributes: ["id"],
			},
		],
	})

	const imap = inputs.map((o) => InputSchema.parse(o))
	websocket.talk(peer.id, imap, "input", "Create")
	console.info("Esp32::Sending inputs.")
}

const onRetrieveAction: WebSocketEventHandler = async (peer, data, esp32) => {
	const actions = await Action.findAll({
		include: [
			{
				model: Input,
				as: "input",
				required: true,
				attributes: ["id"],
				include: [
					{
						model: Actuator,
						as: "actuator",
						where: { esp32Id: esp32.id },
						required: true,
						attributes: ["id"],
					},
				],
			}
		],
	})
	
	const amap = actions.map((a) => a.dataValues)
	websocket.talk(peer.id, amap, "action", "Create")
	console.info("Esp32::Sending actions.")
}

//

const init = () => {
	const listeners: WebSocketEventListener[] = [
		{ event: "pin", query: "Retrieve", handler: onRetrievePin },
		{ event: "sensor", query: "Retrieve", handler: onRetrieveSensor },
		{ event: "output", query: "Retrieve", handler: onRetrieveOutput },
		{ event: "actuator", query: "Retrieve", handler: onRetrieveActuator },
		{ event: "input", query: "Retrieve", handler: onRetrieveInput },
		{ event: "action", query: "Retrieve", handler: onRetrieveAction },
	]

	listeners.forEach((l) => event.listen(l))
	console.info(`Esp32::Handler event listeners initialized.`)
}

//

export default { init }
