import type { Esp32Cam } from "~~/shared/schema/esp32-cam"

//

export const useEsp32CamStore = defineStore("esp32Cam", () => {
    // --- Data
    const esp32Cams = reactive<Esp32Cam[]>([])

    // --- These applies dedups
    const append = (esp32Cam: Esp32Cam) => {
        const idx = esp32Cams.findIndex((g) => g.id == esp32Cam.id)
        if (idx != -1) esp32Cams.splice(idx, 1, esp32Cam)
        else esp32Cams.push(esp32Cam)
    }

    const change = (esp32Cam: Esp32Cam) => {
        const idx = esp32Cams.findIndex((g) => g.id == esp32Cam.id)
        if (idx != -1) esp32Cams.splice(idx, 1, esp32Cam)
    }

    const remove = (id: number) => {
        const filtered = esp32Cams.filter((g) => g.id != id)
        esp32Cams.splice(0, esp32Cams.length)
        esp32Cams.push(...filtered)
    }

    // --- Expose
    return { esp32Cams, append, change, remove }
})