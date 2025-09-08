import { Detection } from "~~/shared/schema/detection";
import { Capture as CaptureModel } from "~~/server/models/capture"
import { Esp32Cam as Esp32CamModel } from "~~/server/models/esp32-cam"
import { Greenhouse as GreenhouseModel } from "~~/server/models/greenhouse"
import registry from "../registry";
import websocket from "../websocket";

//

const create = async (detection: Detection) => {
    const capture = await CaptureModel.findOne({
        where: { id: detection.captureId },
        attributes: ["id"],
        include: [
            {
                model: Esp32CamModel,
                as: "esp32Cam",
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

    if (!capture) return console.warn(`Data detection created without capture.`)
    const userId = (capture as any).esp32Cam.greenhouse.userId as number
    
    for (const [pid, user] of registry.users) {
        if (user.id != userId) continue
        websocket.talk(pid, [detection], "detection", "Create")
    }
}

//

export default { create }
