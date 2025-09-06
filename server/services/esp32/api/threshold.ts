import thresholdService from "../threshold";
import { Threshold } from "~~/shared/schema/threshold";

//

const update = (threshold: Threshold) => {
    for (const [pid, set] of thresholdService.registry.thresholds) {
        for (const t of set) {
            if (t.id != threshold.id) continue
            t.name = threshold.name
            t.operator = threshold.operator
            t.disabled = threshold.disabled
        }
    }
}

const destroy = (threshold: Pick<Threshold, "id">) => {
    for (const [pid, set] of thresholdService.registry.thresholds) {
		for (const t of set) {
			if (t.id != threshold.id) continue
            set.delete(t)
            thresholdService.registry.conditions.delete(t.id)
		}
    }
}

//

export default { update, destroy }
