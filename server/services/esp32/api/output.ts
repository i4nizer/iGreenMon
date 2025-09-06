import { Output } from "~~/shared/schema/output";
import reading from "../reading";

//

const create = (output: Output) => {
    const set = reading.registry.outputs.get(output.sensorId)
    if (!set) return
    set.add(output.id)
}

const destroy = (output: Pick<Output, "id" | "sensorId">) => {
    const set = reading.registry.outputs.get(output.sensorId)
    if (!set) return
    set.delete(output.id)
    reading.output.dequeue(output.id)
}

//

export default { create, destroy }
