import pool from "./pool"
import event from "./event"
import * as schema from "./schema"

//

// --- Handles timing out
const loop = () => {
	for (const [uid, lid] of pool.logs) {
		// --- Get time lived
		const now = Date.now()
		let birth = pool.timer.get(uid)
		if (!birth) pool.timer.set(uid, now)
		if (!birth) birth = now

		const timedout = now - birth > 60000
		if (!timedout) return
		pool.timer.set(uid, now)
		event.invoke("Timeout", uid, lid)
	}
}

//

export default { loop, pool, event, schema }
