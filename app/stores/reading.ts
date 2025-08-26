import type { Reading } from "~~/shared/schema/reading"

//

export const useReadingStore = defineStore("reading", () => {
    // --- Data
    const readings = reactive<Reading[]>([])

    // --- These applies dedups
    const append = (reading: Reading) => {
        const idx = readings.findIndex((o) => o.id == reading.id)
        if (idx != -1) readings.splice(idx, 1, reading)
        else readings.push(reading)
    }

    const change = (reading: Reading) => {
        const idx = readings.findIndex((o) => o.id == reading.id)
        if (idx != -1) readings.splice(idx, 1, reading)
    }

    const remove = (id: number) => {
        const filtered = readings.filter((o) => o.id != id)
        readings.splice(0, readings.length)
        readings.push(...filtered)
    }

    // --- Expose
    return { readings, append, change, remove }
})