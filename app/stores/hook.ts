import type { Hook } from "~~/shared/schema/hook"

//

export const useHookStore = defineStore("hook", () => {
    // --- Data
    const hooks = reactive<Hook[]>([])

    // --- These applies dedups
    const append = (hook: Hook) => {
        const idx = hooks.findIndex((o) => o.id == hook.id)
        if (idx != -1) hooks.splice(idx, 1, hook)
        else hooks.push(hook)
    }

    const change = (hook: Hook) => {
        const idx = hooks.findIndex((o) => o.id == hook.id)
        if (idx != -1) hooks.splice(idx, 1, hook)
    }

    const remove = (id: number) => {
        const filtered = hooks.filter((o) => o.id != id)
        hooks.splice(0, hooks.length)
        hooks.push(...filtered)
    }

    // --- Expose
    return { hooks, append, change, remove }
})