import { Detection } from "~~/shared/schema/detection";
import { Capture as CaptureModel } from "~~/server/models/capture";
import { Esp32Cam as Esp32CamModel } from "~~/server/models/esp32-cam"
import { Greenhouse as GreenhouseModel } from "~~/server/models/greenhouse"
import { User as UserModel } from "~~/server/models/user"
import { queueEmail } from "../../email";
import esp32Cam from "../../esp32-cam";

//

const onCreate = async (detection: Detection) => {
    if (detection.class == NPKModelClass[0]) return

    const capture = await CaptureModel.findOne({
        where: { id: detection.captureId },
        attributes: ["id", "filename"],
        include: [
            {
                model: Esp32CamModel,
                as: "esp32Cam",
                required: true,
                attributes: ["id", "name"],
                include: [
                    {
                        model: GreenhouseModel,
                        as: "greenhouse",
                        required: true,
                        attributes: ["id", "name"],
                        include: [
                            {
                                model: UserModel,
                                as: "user",
                                required: true,
                                attributes: ["id", "name", "email"],
                            },
                        ],
                    },
                ],
            },
        ],
    })

    if (!capture) return console.warn(`Detection created, capture not found.`)
    const user = (capture as any).esp32Cam.greenhouse.user
    const greenhouse = (capture as any).esp32Cam.greenhouse
    const esp32Cam = (capture as any).esp32Cam

    const ssres = await useTemplate({
        type: "NPK-Deficiency-Detected",
        safe: true,
        data: {
            capture: capture.filename,
            class: detection.class,
            confidence: detection.confidence,
            esp32Cam: esp32Cam.name,
            greenhouse: greenhouse.name,
            user: user.name,
        },
    })

    if (!ssres.success) return console.error(ssres.error)
    queueEmail(
        user.email,
        "NPK Deficiency Detected",
        undefined,
        ssres.data,
        (e, i) => e ? console.error(e) : console.info(`Email npk sent.`)
    )
}

//

const init = () => {
    esp32Cam.hook.detection.onCreate(onCreate)
}

//

export default { init }
