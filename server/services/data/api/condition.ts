import { Condition } from "~~/shared/schema/condition";
import { Threshold as ThresholdModel } from "~~/server/models/threshold"
import { Greenhouse as GreenhouseModel } from "~~/server/models/greenhouse"
import registry from "../registry";
import websocket from "../websocket";

//

const update = async (condition: Condition) => {
    const threshold = await ThresholdModel.findOne({
        where: { id: condition.thresholdId },
        attributes: ["id"],
        include: [
            {
                model: GreenhouseModel,
                as: "greenhouse",
                required: true,
                attributes: ["userId"],
            },
        ],
    })

    if (!threshold) return console.warn(`Data condition update, threshold not found.`)
    const userId = (threshold as any).greenhouse.userId as number
    for (const [pid, user] of registry.users) {
        if (user.id != userId) continue
        websocket.talk(pid, [condition], "condition", "Update")
    }
}

//

export default { update }
