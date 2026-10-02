import hook from "./hook"
import event from "./event"
import { Peer } from "crossws"
import { Esp32Cam } from "~~/shared/schema/esp32-cam"
import { Capture as CaptureModel } from "~~/server/models/capture"
import { NPKModel } from "../model"
import { uploadImageAsync } from "../cloudinary"
import { Detection as DetectionModel } from "~~/server/models/detection"

//

// --- Saves capture and detection typically
const onReceiveImage = async (
    peer: Peer,
    image: ArrayBuffer | SharedArrayBuffer,
    esp32Cam: Esp32Cam
) => {
    // --- Upload image file
    const raw = Buffer.from(image)
    const file = `${Date.now()}.jpg`
    await uploadImageAsync(raw, file)

    // --- Save capture
    const capture = await CaptureModel.create({
        filename: file,
        esp32CamId: esp32Cam.id,
    })
    hook.capture.create(capture)
    
    // --- Predict NPK and create detections
    const res = await NPKModel.predict(image)
    if (!res.success) return console.error(res.error)

    const bboxes = res.data.map((b) => ({ ...b, captureId: capture.id }))
    if (bboxes.length <= 0) return
    const detections = await DetectionModel.bulkCreate(bboxes)
    detections.forEach((d) => hook.detection.create(d))
}

//

const init = () => {
    event.listen(onReceiveImage)
    console.info(`Esp32Cam syncer initialized.`)
}

//

export default { init }
