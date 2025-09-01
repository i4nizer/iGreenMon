import type { Log } from "~~/shared/schema/log"

//

export const useLogStore = defineStore("log", () => {
    // --- Data
    const logs = reactive<Log[]>([])

    // --- These applies dedups
    const append = (log: Log) => {
        const idx = logs.findIndex((o) => o.id == log.id)
        if (idx != -1) logs.splice(idx, 1, log)
        else logs.push(log)
    }

    const change = (log: Log) => {
        const idx = logs.findIndex((o) => o.id == log.id)
        if (idx != -1) logs.splice(idx, 1, log)
    }

    const remove = (id: number) => {
        const filtered = logs.filter((o) => o.id != id)
        logs.splice(0, logs.length)
        logs.push(...filtered)
    }

    // --- Expose
    return { logs, append, change, remove }
})