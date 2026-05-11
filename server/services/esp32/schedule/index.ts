import pool from "./pool"
import event from "./event"
import registry from "./registry"
import * as schema from "./schema"

//

let refreshedMonth = -1

//

const loop = () => {
    // --- Event loop
    const now = new Date()
    for (const [pid, set] of registry.schedules) {
        for (const schedule of set) {
            const unixes = pool.schedules.get(schedule.id)
            if (!unixes) continue

            for (const unix of unixes) {
                if (now.getTime() < unix) continue
                console.log(`Schedule schedule ${schedule.name} triggered.`)
                unixes.delete(unix)
                event.invoke(pid, schedule)
            }
        }
    }

    // --- Refresh loop (re-queue on new month or first run)
    if (refreshedMonth == now.getMonth()) return

    for (const [pid, set] of registry.schedules) {
        for (const schedule of set) {
            pool.queue(schedule)
		}
    }
    refreshedMonth = now.getMonth()
    console.log(`Schedule schedules refreshed.`)
}

//

export default { loop, registry, event, schema, pool }
