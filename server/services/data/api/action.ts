import registry from "../registry";
import websocket from "../websocket";
import { Action } from "~~/shared/schema/action";
import { Input as InputModel } from "~~/server/models/input"
import { Actuator as ActuatorModel } from "~~/server/models/actuator"
import { Esp32 as Esp32Model } from "~~/server/models/esp32"
import { Greenhouse as GreenhouseModel } from "~~/server/models/greenhouse"

//

const update = async (action: Action) => {
    const input = await InputModel.findOne({
        where: { id: action.inputId },
        attributes: ["id"],
        include: [
            {
                model: ActuatorModel,
                as: "actuator",
                required: true,
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
            },
        ],
    })

    if (!input) return console.warn(`Data action updated, input not found.`)
    const userId = (input as any).actuator.esp32.greenhouse.userId
    for (const [pid, user] of registry.users) {
        if (user.id != userId) continue
        websocket.talk(pid, [action], "action", "Update")
    }
}

//

export default { update }
