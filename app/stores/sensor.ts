import type { Sensor } from "~~/shared/schema/sensor"

//

export const useSensorStore = defineStore("sensor", () => {
    // --- Data
    const sensors = reactive<Sensor[]>([])

    // --- These applies dedups
    const append = (sensor: Sensor) => {
        const idx = sensors.findIndex((g) => g.id == sensor.id)
        if (idx != -1) sensors.splice(idx, 1, sensor)
        else sensors.push(sensor)
    }

    const change = (sensor: Sensor) => {
        const idx = sensors.findIndex((g) => g.id == sensor.id)
        if (idx != -1) sensors.splice(idx, 1, sensor)
    }

    const remove = (id: number) => {
        const filtered = sensors.filter((g) => g.id != id)
        sensors.splice(0, sensors.length)
        sensors.push(...filtered)
    }

    // --- Expose
    return { sensors, append, change, remove }
})