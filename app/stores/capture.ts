import type { Capture } from "~~/shared/schema/capture"

//

export const useCaptureStore = defineStore("capture", () => {
    // --- Data
    const captures = reactive<Capture[]>([])

    // --- These applies dedups
    const append = (capture: Capture) => {
        const idx = captures.findIndex((o) => o.id == capture.id)
        if (idx != -1) captures.splice(idx, 1, capture)
        else captures.push(capture)
    }

    const change = (capture: Capture) => {
        const idx = captures.findIndex((o) => o.id == capture.id)
        if (idx != -1) captures.splice(idx, 1, capture)
    }

    const remove = (id: number) => {
        const filtered = captures.filter((o) => o.id != id)
        captures.splice(0, captures.length)
        captures.push(...filtered)
    }

    // --- Expose
    return { captures, append, change, remove }
})