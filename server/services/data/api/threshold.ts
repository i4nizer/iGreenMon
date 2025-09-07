import registry from "../registry";
import websocket from "../websocket";
import { Threshold } from "~~/shared/schema/threshold";
import { Greenhouse as GreenhouseModel } from "~~/server/models/greenhouse"

//

const update = async (threshold: Threshold) => {
    const greenhouse = await GreenhouseModel.findOne({
        where: { id: threshold.greenhouseId },
        attributes: ["userId"],
    })

    if (!greenhouse) return console.warn(`Data threshold updated, greenhouse not found.`)
    const userId = (greenhouse as any).userId
    for (const [pid, user] of registry.users) {
        if (user.id != userId) continue
        websocket.talk(pid, [threshold], "threshold", "Update")
    }
}

//

export default { update }
