import type { Schedule } from "~~/shared/schema/schedule"

//

export const useScheduleStore = defineStore("schedule", () => {
    // --- Data
    const schedules = reactive<Schedule[]>([])

    // --- These applies dedups
    const append = (schedule: Schedule) => {
        const idx = schedules.findIndex((g) => g.id == schedule.id)
        if (idx != -1) schedules.splice(idx, 1, schedule)
        else schedules.push(schedule)
    }

    const change = (schedule: Schedule) => {
        const idx = schedules.findIndex((g) => g.id == schedule.id)
        if (idx != -1) schedules.splice(idx, 1, schedule)
    }

    const remove = (id: number) => {
        const filtered = schedules.filter((g) => g.id != id)
        schedules.splice(0, schedules.length)
        schedules.push(...filtered)
    }

    // --- Expose
    return { schedules, append, change, remove }
})