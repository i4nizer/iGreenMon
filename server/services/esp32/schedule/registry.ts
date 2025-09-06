import pool from "./pool"
import {
    type ScheduleItem,
    ScheduleItemSchema,
} from "./schema"

//

// --- Registry
const schedules = new Map<string, Set<ScheduleItem>>() // Peer.id => ScheduleItem[]

//

const register = async (pid: string, schedule: any) => {
    // --- Parse schedule
    const sres = ScheduleItemSchema.safeParse(schedule)
    if (!sres.success) return

    // --- Set schedule
    const sset = schedules.get(pid)
    if (sset) {
        for (const s of sset) {
            if (s.id != sres.data.id) continue
            sset.delete(s)
        }
        sset.add(sres.data)
    }
    else schedules.set(pid, new Set([sres.data]))
    
    pool.queue(sres.data)
    console.info(`Schedule schedule ${schedule.name} registered.`)
}

const unregister = (pid: string) => {
    const sitem = schedules.get(pid)
    if (sitem) sitem.forEach((s) => pool.dequeue(s.id))
    schedules.delete(pid)
    if (sitem) console.info(`Schedule esp32 unregistered ${sitem.size} schedules.`)
}

//

export default { schedules, register, unregister }
