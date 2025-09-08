import type { Detection } from "~~/shared/schema/detection"

//

export const useDetectionStore = defineStore("detection", () => {
    // --- Data
    const detections = reactive<Detection[]>([])

    // --- These applies dedups
    const append = (detection: Detection) => {
        const idx = detections.findIndex((d) => d.id == detection.id)
        if (idx != -1) detections.splice(idx, 1, detection)
        else detections.push(detection)
    }

    const change = (detection: Detection) => {
        const idx = detections.findIndex((d) => d.id == detection.id)
        if (idx != -1) detections.splice(idx, 1, detection)
    }

    const remove = (id: number) => {
        const filtered = detections.filter((d) => d.id != id)
        detections.splice(0, detections.length)
        detections.push(...filtered)
    }

    // --- Expose
    return { detections, append, change, remove }
})