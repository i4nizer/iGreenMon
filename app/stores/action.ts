import type { Action } from "~~/shared/schema/action"

//

export const useActionStore = defineStore("action", () => {
    // --- Data
    const actions = reactive<Action[]>([])

    // --- These applies dedups
    const append = (action: Action) => {
        const idx = actions.findIndex((a) => a.id == action.id)
        if (idx != -1) actions.splice(idx, 1, action)
        else actions.push(action)
    }

    const change = (action: Action) => {
        const idx = actions.findIndex((a) => a.id == action.id)
        if (idx != -1) actions.splice(idx, 1, action)
    }

    const remove = (id: number) => {
        const filtered = actions.filter((a) => a.id != id)
        actions.splice(0, actions.length)
        actions.push(...filtered)
    }

    // --- Expose
    return { actions, append, change, remove }
})