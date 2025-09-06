import event from "./event"
import { SensorItem } from "./schema"
import { SensorReadPhase } from "~~/shared/schema/sensor"
import { Sensor as SensorModel } from "~~/server/models/sensor"

//

// --- Sensor update -> to db
const onUpdateSensor = (readphase: SensorReadPhase) => {
    return async (id: string, sensor: Readonly<SensorItem>) => {
        const { id: sid, lastread } = sensor
        await SensorModel.update(
            { lastread, readphase },
            { where: { id: sid } },
        )
    }
}

//

const init = () => {
    event.listen("Off", onUpdateSensor("Off"))
    event.listen("Before", onUpdateSensor("Before"))
    event.listen("During", onUpdateSensor("During"))
    event.listen("After", onUpdateSensor("After"))

    console.info(`Reading::Syncer initialized.`)
}

//

export default { init }
