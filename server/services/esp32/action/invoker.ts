import pool from "./pool";
import event from "./event";
import { ActionItem } from "./schema";
import { ActionStatus } from "~~/shared/schema/action";

//

const invoke = (action: ActionItem, force = false): ActionStatus => {
    const copy = pool.actions.get(action.id)
    if (copy) return copy.status

    // --- Loop through for possible interrupts
    let matches = 0
    let interrupts = 0
    for (const [id, a] of pool.actions) {
        // --- Shares the same input
        if (action.inputId != a.inputId) continue
        matches++
        
        // --- Higher precedence
        const weak = action.priority > a.priority
        const forced = action.priority >= a.priority && force
        if (!weak && !forced) continue

        // --- Interupt it
        interrupts++
        console.info(`Action::Action ${a.id} got interrupted.`)
        pool.dequeue(a.id)
        event.invoke("Interrupted", a)
    }

    // --- Can't interrupt anyone
    if (matches > 0 && interrupts <= 0) {
        console.info(`Action::Action ${action.id} got discarded.`)
        event.invoke("Discarded", action)
        return ActionStatus[3]
    }

    // --- Queue to wait for it to timeout or be done
    pool.queue(action)
    
    // --- Invoke as either delayed or active
    const delayed = action.delay > 0
    if (delayed) event.invoke("Delayed", action)
    else event.invoke("Active", action)
    
    return delayed ? ActionStatus[1] : ActionStatus[2]
}

//

export default { invoke }
