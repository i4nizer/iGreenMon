import { Sensor } from "~~/shared/schema/sensor";
import { Esp32 as Esp32Model } from "~~/server/models/esp32"
import { Greenhouse as GreenhouseModel } from "~~/server/models/greenhouse"
import registry from "../registry";
import websocket from "../websocket";

//

const update = async (sensor: Sensor) => {
    const esp32 = await Esp32Model.findOne({
        where: { id: sensor.esp32Id },
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

    if (!esp32) return console.warn(`Data sensor updated, esp32 not found.`)
    const userId = (esp32 as any).greenhouse.userId
    for (const [pid, user] of registry.users) {
        if (user.id != userId) continue
        websocket.talk(pid, [sensor], "sensor", "Update")
    }
}

//

export default { update }
