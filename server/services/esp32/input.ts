import registry from "./registry";
import websocket from "./websocket";
import { InputUpdate } from "~~/shared/schema/input";
import { Pin as PinModel } from "~~/server/models/pin"

//

const update = async (input: InputUpdate) => {
    const pin = await PinModel.findOne({
        where: { id: input.pinId },
        attributes: ["esp32Id"],
    })
    if (!pin) return console.warn(`Esp32::Esp32 input updated, esp32 not connected.`)

    for (const [peer, esp32] of registry.esp32s) {
        if (esp32.id != pin.esp32Id) continue
        websocket.talk(peer.id, [input], "input", "Update")
    }
}

//

export default { update }
