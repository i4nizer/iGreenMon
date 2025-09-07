import { Sensor } from "~~/shared/schema/sensor"
import { HookHandler } from "./type"

//

const uhooks: HookHandler<Sensor>[] = []

//

const onUpdate = (hook: HookHandler<Sensor>) => uhooks.push(hook)

//

const update = (sensor: Sensor) => uhooks.forEach((h) => h(sensor))

//

export default { onUpdate, update }
