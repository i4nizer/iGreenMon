import registry from "../registry"
import websocket from "../websocket"
import { Input } from "~~/shared/schema/input"
import { Pin as PinModel } from "~~/server/models/pin"

//

const update = async (input: Input) => {
	const pin = await PinModel.findOne({
		where: { id: input.pinId },
		attributes: ["esp32Id"],
	})
	if (!pin) return console.warn(`Esp32 input updated, pin not found.`)

	for (const [peer, esp32] of registry.esp32s) {
		if (esp32.id != pin.esp32Id) continue
		websocket.talk(peer.id, [input], "input", "Update")
	}
}

//

export default { update }
