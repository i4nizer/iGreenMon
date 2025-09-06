import { Condition as ConditionModel } from "~~/server/models/condition"
import {
	ThresholdItemSchema,
    ThresholdItem,
    ConditionItem,
} from "./schema"

//

// --- Registry
const thresholds = new Map<string, Set<ThresholdItem>>() // Peer.id   => ThresholdItem[]
const conditions = new Map<number, Set<ConditionItem>>() // Threshold.id => ConditionItem[]

//

const register = async (pid: string, threshold: any) => {
    const tres = ThresholdItemSchema.safeParse(threshold)
    if (!tres.success) return

    const tset = thresholds.get(pid)
    if (tset) tset.add(threshold)
    else thresholds.set(pid, new Set([tres.data]))
    console.info(`Threshold::Threshold ${threshold.name} registered.`)
    
    const cres = await ConditionModel.findAll({
        where: { thresholdId: tres.data.id },
        attributes: [
            "id",
            "type",
            "value",
            "satisfied",
            "outputId",
            "thresholdId",
        ],
    })

    const cset = conditions.get(tres.data.id)
    if (cset) cres.forEach((c) => cset.add(c.dataValues))
    else conditions.set(tres.data.id, new Set(cres.map((c) => c.dataValues)))
    console.info(`Threshold::Condition ${cres.length} registered.`)
}

const unregister = (pid: string) => {
	const titem = thresholds.get(pid)
	if (titem) titem.forEach((s) => conditions.delete(s.id))
	thresholds.delete(pid)
	if (titem) console.info(`Threshold::Threshold unregistered ${titem.size} thresholds.`)
}

//

export default { thresholds, conditions, register, unregister }
