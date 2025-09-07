import registry from "../registry";
import websocket from "../websocket";
import { Input } from "~~/shared/schema/input";
import { Esp32 as Esp32Model } from "~~/server/models/esp32"
import { Actuator as ActuatorModel } from "~~/server/models/actuator"
import { Greenhouse as GreenhouseModel } from "~~/server/models/greenhouse"

//

const update = async (input: Input) => {
    const actuator = await ActuatorModel.findOne({
        where: { id: input.actuatorId },
        attributes: ["id"],
        include: [
            {
                model: Esp32Model,
                as: "esp32",
                required: true,
                attributes: ["id"],
                include: [
                    {
                        model: GreenhouseModel,
                        as: "greenhouse",
                        required: true,
                        attributes: ["userId"],
                    },
                ],
            },
        ],
    })

    if (!actuator) return console.warn(`Data input updated, actuator not found.`)
    const userId = (actuator as any).esp32.greenhouse.userId
    for (const [pid, user] of registry.users) {
        if (user.id != userId) continue
        websocket.talk(pid, [input], "input", "Update")
    }
}

//

export default { update }
