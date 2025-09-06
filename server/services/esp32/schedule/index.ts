import pool from "./pool"
import event from "./event"
import registry from "./registry"
import * as schema from "./schema"

//

let refreshed = true

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
                console.log(`Schedule::Schedule ${schedule.name} triggered.`)
                unixes.delete(unix)
                event.invoke(pid, schedule)
            }
        }
    }

    // --- Refresh loop
    if (refreshed && now.getDate() == 2) refreshed = false
    if (refreshed || now.getDate() != 1) return

    for (const [pid, set] of registry.schedules) {
        for (const schedule of set) {
            pool.queue(schedule)
		}
    }
    console.log(`Schedule::Schedules refreshed.`)
}

//

export default { loop, registry, event, schema }
