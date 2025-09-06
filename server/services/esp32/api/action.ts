import registry from "../registry";
import websocket from "../websocket";
import actionService from "../action"
import { Action } from "~~/shared/schema/action";
import { Pin as PinModel } from "~~/server/models/pin";
import { Input as InputModel } from "~~/server/models/input";

//

const create = async (action: Action) => {
    const input = await InputModel.findOne({
		where: { id: action.inputId },
		attributes: ["id"],
		include: [
			{
				model: PinModel,
				as: "pin",
				required: true,
				attributes: ["esp32Id"],
			},
		],
	})
	if (!input) return console.warn(`Esp32 api action input not found.`)

	const esp32Id = (input as any).pin.esp32Id as number
	for (const [peer, esp32] of registry.esp32s) {
		if (esp32.id != esp32Id) continue
		websocket.talk(peer.id, [action], "action", "Create")
	}
}

const update = async (action: Action) => {
    for (const [aid, act] of actionService.pool.actions) {
        if (act.id != action.id) continue
        act.name = action.name
        act.value = action.value
        act.delay = action.delay
        act.timeout = action.timeout
        act.duration = action.duration
        act.priority = action.priority
        act.inputId = action.inputId
    }

    const input = await InputModel.findOne({
        where: { id: action.inputId },
        attributes: ["id"],
        include: [
            {
                model: PinModel,
                as: "pin",
                required: true,
                attributes: ["esp32Id"],
            },
        ],
    })
    if (!input) return console.warn(`Esp32 api action input not found.`)
    
    const esp32Id = (input as any).pin.esp32Id as number
    for (const [peer, esp32] of registry.esp32s) {
        if (esp32.id != esp32Id) continue
        websocket.talk(peer.id, [action], "action", "Update")
    }
}

const destroy = async (action: Pick<Action, "id" | "inputId">) => {
    for (const [aid, act] of actionService.pool.actions) {
		if (act.id != action.id) continue
		actionService.pool.dequeue(aid)
	}

    const input = await InputModel.findOne({
		where: { id: action.inputId },
		attributes: ["id"],
		include: [
			{
				model: PinModel,
				as: "pin",
				required: true,
				attributes: ["esp32Id"],
			},
		],
	})
	if (!input) return console.warn(`Esp32 api action input not found.`)

    const esp32Id = (input as any).pin.esp32Id as number
    for (const [peer, esp32] of registry.esp32s) {
		if (esp32.id != esp32Id) continue
		websocket.talk(peer.id, [action], "action", "Delete")
	}
}

//

export default { create, update, destroy }
