import condition from "./condition"
import { Condition as ConditionModel } from "~~/server/models/condition"
import { Threshold as ThresholdModel } from "~~/server/models/threshold"
import { ConditionEventListener, ThresholdEventListener } from "./schema"
import event from "./event"

//

// --- Updates condition state in db
const onEvalCondition: ConditionEventListener = async (
	condition,
	changed
) => {
	if (!changed) return
	const { id, satisfied } = condition
	await ConditionModel.update({ satisfied }, { where: { id } })
}

// --- Updates threshold state in db
const onEvalThreshold: ThresholdEventListener = async (
	pid,
	threshold,
	changed
) => {
    if (!changed) return
    const { id, activated } = threshold
    await ThresholdModel.update({ activated }, { where: { id } })
}

//

const init = () => {
    event.listen("Activate", onEvalThreshold)
    event.listen("Deactivate", onEvalThreshold)
    condition.listen("Satisfied", onEvalCondition)
    condition.listen("Desatisfied", onEvalCondition)
    console.info(`Threshold::Syncer initialized.`)
}

//

export default { init }
