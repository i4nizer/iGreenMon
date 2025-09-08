import registry from "../registry"
import websocket from "../websocket"
import { Capture } from "~~/shared/schema/capture"
import { Esp32Cam as Esp32CamModel } from "~~/server/models/esp32-cam"
import { Greenhouse as GreenhouseModel } from "~~/server/models/greenhouse"

//

const create = async (capture: Capture) => {
	const esp32Cam = await Esp32CamModel.findOne({
		where: { id: capture.esp32CamId },
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

	if (!esp32Cam)return console.warn(`Data capture created, esp32-cam not found.`)
	const userId = (esp32Cam as any).greenhouse.userId as number
	
    for (const [pid, user] of registry.users) {
		if (user.id != userId) continue
		websocket.talk(pid, [capture], "capture", "Create")
	}
}

//

export default { create }
