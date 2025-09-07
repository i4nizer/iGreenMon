import pool from "./pool"
import event from "./event"
import invoker from "./invoker"
import * as schema from "./schema"

//

/**
 * Concerns:
 * - Delayed to Active
 * - Active to Timeout
 */
const loop = () => {
	for (const [aid, birth] of pool.birthcert) {
		const now = Date.now()
		const action = pool.actions.get(aid)
		if (!action) continue

		// --- Delayed to Active
		if (action.status == "Delayed") {
			const ready = now - birth > action.delay
			if (ready) event.invoke("Active", action)
		}

		// --- Active to timeout
		if (action.status == "Active") {
			const { delay, duration, timeout } = action
			const dead = now - birth - delay - duration > timeout
			if (!dead) continue
			pool.dequeue(aid)
			event.invoke("Timeout", action)
		}
	}
}

//

export default { loop, pool, event, schema, invoker }
