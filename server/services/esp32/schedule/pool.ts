import { ScheduleItem } from "./schema"

//

const schedules = new Map<number, Set<number>>() // Schedule.id => unix[]

//

const queue = (schedule: ScheduleItem) => {
	const sitem = schedules.get(schedule.id)
	if (sitem) sitem.delete(schedule.id)

	const now = new Date()
	const unixs = new Set<number>()

	for (const day of schedule.days) {
		for (const tstr of schedule.times) {
			const [hour, min] = tstr.split(":").map(Number)
			const date = new Date(
				now.getFullYear(),
				now.getMonth(),
				day,
				hour,
				min
			)

			if (now.getTime() > date.getTime()) continue
			unixs.add(date.getTime())
		}
	}

    schedules.set(schedule.id, unixs)
    console.info(`Schedule schedule ${schedule.id} queued.`)
}

const dequeue = (sid: number) => {
    const res = schedules.delete(sid)
    if (res) console.info(`Schedule schedule ${sid} dequeued.`)
}

//

export default { schedules, queue, dequeue }
