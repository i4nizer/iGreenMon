import threshold from "../threshold";
import { Condition } from "~~/shared/schema/condition";

//

const create = (condition: Condition) => {
    for (const [tid, set] of threshold.registry.conditions) {
        if (tid != condition.thresholdId) continue
        set.add(condition)
    }
}

const update = (condition: Condition) => {
    for (const [tid, set] of threshold.registry.conditions) {
		if (tid != condition.thresholdId) continue
        for (const c of set) {
            if (c.id != condition.id) continue
            c.value = condition.value
            c.type = condition.type
            c.outputId = condition.outputId
        }
    }
}

const destroy = (condition: Pick<Condition, "id" | "thresholdId">) => {
    for (const [tid, set] of threshold.registry.conditions) {
		if (tid != condition.thresholdId) continue
        for (const c of set) {
            if (c.id != condition.id) continue
            set.delete(c)
        }
    }
}

//

export default { create, update, destroy }
