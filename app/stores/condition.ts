import type { Condition } from "~~/shared/schema/condition"

//

export const useConditionStore = defineStore("condition", () => {
    // --- Data
    const conditions = reactive<Condition[]>([])

    // --- These applies dedups
    const append = (condition: Condition) => {
        const idx = conditions.findIndex((g) => g.id == condition.id)
        if (idx != -1) conditions.splice(idx, 1, condition)
        else conditions.push(condition)
    }

    const change = (condition: Condition) => {
        const idx = conditions.findIndex((g) => g.id == condition.id)
        if (idx != -1) conditions.splice(idx, 1, condition)
    }

    const remove = (id: number) => {
        const filtered = conditions.filter((g) => g.id != id)
        conditions.splice(0, conditions.length)
        conditions.push(...filtered)
    }

    // --- Expose
    return { conditions, append, change, remove }
})