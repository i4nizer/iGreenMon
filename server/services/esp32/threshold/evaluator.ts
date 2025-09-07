import event from "./event"
import registry from "./registry"
import condition from "./condition"
import { ReadingCreate } from "~~/shared/schema/reading"

//

// --- Finds corresponding condition to evaluate
const evalcond = (reading: ReadingCreate) => {
	for (const [tid, set] of registry.conditions) {
		for (const con of set) {
			if (con.outputId != reading.outputId) continue

			let satisfied =
				(con.type == "Below" && reading.value < con.value) ||
				(con.type == "Equal" && reading.value == con.value) ||
                (con.type == "Above" && reading.value > con.value)
            
            const changed = satisfied != con.satisfied
            const event = satisfied ? "Satisfied" : "Desatisfied"
            console.info(`Condition eval ${reading.value} ${con.type} ${con.value} ${event}.`)
            
            con.satisfied = satisfied
            condition.invoke(event, con, changed)
			evalthresh(tid)
		}
	}
}

// --- Finds threshold conditions and evals to the thresholds rubriks
const evalthresh = (tid: number) => {
    for (const [pid, tset] of registry.thresholds) {
        for (const threshold of tset) {
            if (threshold.id != tid) continue
            
            const { operator, activated } = threshold
            const all = operator == "All"
            let satisfied = false
            
            const cset = registry.conditions.get(tid)
            if (!cset) continue

            for (const condition of cset) {
                if (satisfied) break
                if (all) satisfied = satisfied && condition.satisfied
                else satisfied = satisfied || condition.satisfied
            }               

            const changed = activated != satisfied
            const evn = satisfied ? "Activate" : "Deactivate"
            threshold.activated = satisfied
            event.invoke(pid, threshold, evn, changed)
        }
    }
}

//

export default { evalcond, evalthresh }
