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
    const sitem = schedules.get(pid)
    if (sitem) sitem.add(sres.data)
    else schedules.set(pid, new Set([sres.data]))
    
    pool.queue(sres.data)
    console.info(`Schedule::Schedule ${schedule.name} registered.`)
}

const unregister = (pid: string) => {
    const sitem = schedules.get(pid)
    if (sitem) sitem.forEach((s) => pool.dequeue(s.id))
    schedules.delete(pid)
    if (sitem) console.info(`Schedule::Esp32 unregistered ${sitem.size} schedules.`)
}

//

export default { schedules, register, unregister }
