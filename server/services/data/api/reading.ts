import registry from "../registry";
import websocket from "../websocket";
import { Reading } from "~~/shared/schema/reading";
import { Esp32 as Esp32Model } from "~~/server/models/esp32"
import { Output as OutputModel } from "~~/server/models/output";
import { Sensor as SensorModel } from "~~/server/models/sensor";
import { Greenhouse as GreenhouseModel } from "~~/server/models/greenhouse"

//

const create = async (reading: Reading) => {
    const output = await OutputModel.findOne({
        where: { id: reading.outputId },
        attributes: ["id"],
        include: [
            {
                model: SensorModel,
                as: "sensor",
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
    
    if (!output) return console.warn(`Data reading created, output not found.`)
    const userId = (output as any).sensor.esp32.greenhouse.userId as number
    for (const [pid, user] of registry.users) {
        if (user.id != userId) continue
        websocket.talk(pid, [reading], "reading", "Create")
    }
}

//

export default { create }
