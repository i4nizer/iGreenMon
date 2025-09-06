import pool from "./pool";
import registry from "./registry";
import { ScheduleEventListener, ScheduleItem } from "./schema";

//

// --- Registry
const listeners = new Set<ScheduleEventListener>([])

//

const listen = (listener: ScheduleEventListener) => {
    listeners.add(listener)
    console.info(`Schedule::Listening to schedule event.`)
}

const unlisten = (listener: ScheduleEventListener) => {
    listeners.delete(listener)
    console.info(`Schedule::Stopped listening to schedule event.`)
}

//

const invoke = (pid: string, schedule: ScheduleItem) => {
    for (const listener of listeners) {
        Promise.resolve()
            .then(() => listener(pid, schedule))
            .catch(console.error)
    }
}

//

export default { listen, unlisten, invoke }