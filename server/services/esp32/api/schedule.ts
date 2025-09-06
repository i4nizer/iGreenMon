import scheduleService from "../schedule";
import { Schedule } from "~~/shared/schema/schedule";

//

const update = async (schedule: Schedule) => {
    const promises = []
    for (const [pid, set] of scheduleService.registry.schedules) {
        for (const s of set) {
            if (s.id != schedule.id) continue
            promises.push(scheduleService.registry.register(pid, schedule))
        }
    }
    await Promise.all(promises).catch(console.error)
}

const destroy = async (schedule: Pick<Schedule, "id">) => {
    for (const [pid, set] of scheduleService.registry.schedules) {
		for (const s of set) {
			if (s.id != schedule.id) continue
            set.delete(s)
            scheduleService.pool.schedules.delete(s.id)
		}
	}
}

//

export default { update, destroy }
