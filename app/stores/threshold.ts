import type { Threshold } from "~~/shared/schema/threshold"

//

export const useThresholdStore = defineStore("threshold", () => {
    // --- Data
    const thresholds = reactive<Threshold[]>([])

    // --- These applies dedups
    const append = (threshold: Threshold) => {
        const idx = thresholds.findIndex((g) => g.id == threshold.id)
        if (idx != -1) thresholds.splice(idx, 1, threshold)
        else thresholds.push(threshold)
    }

    const change = (threshold: Threshold) => {
        const idx = thresholds.findIndex((g) => g.id == threshold.id)
        if (idx != -1) thresholds.splice(idx, 1, threshold)
    }

    const remove = (id: number) => {
        const filtered = thresholds.filter((g) => g.id != id)
        thresholds.splice(0, thresholds.length)
        thresholds.push(...filtered)
    }

    // --- Expose
    return { thresholds, append, change, remove }
})