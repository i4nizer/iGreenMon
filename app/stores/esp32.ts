import type { Esp32 } from "~~/shared/schema/esp32"

//

export const useEsp32Store = defineStore("esp32", () => {
    // --- Data
    const esp32s = reactive<Esp32[]>([])

    // --- These applies dedups
    const append = (esp32: Esp32) => {
        const idx = esp32s.findIndex((g) => g.id == esp32.id)
        if (idx != -1) esp32s.splice(idx, 1, esp32)
        else esp32s.push(esp32)
    }

    const change = (esp32: Esp32) => {
        const idx = esp32s.findIndex((g) => g.id == esp32.id)
        if (idx != -1) esp32s.splice(idx, 1, esp32)
    }

    const remove = (id: number) => {
        const filtered = esp32s.filter((g) => g.id != id)
        esp32s.splice(0, esp32s.length)
        esp32s.push(...filtered)
    }

    // --- Expose
    return { esp32s, append, change, remove }
})