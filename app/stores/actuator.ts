import type { Actuator } from "~~/shared/schema/actuator"

//

export const useActuatorStore = defineStore("actuator", () => {
    // --- Data
    const actuators = reactive<Actuator[]>([])

    // --- These applies dedups
    const append = (actuator: Actuator) => {
        const idx = actuators.findIndex((a) => a.id == actuator.id)
        if (idx != -1) actuators.splice(idx, 1, actuator)
        else actuators.push(actuator)
    }

    const change = (actuator: Actuator) => {
        const idx = actuators.findIndex((a) => a.id == actuator.id)
        if (idx != -1) actuators.splice(idx, 1, actuator)
    }

    const remove = (id: number) => {
        const filtered = actuators.filter((a) => a.id != id)
        actuators.splice(0, actuators.length)
        actuators.push(...filtered)
    }

    // --- Expose
    return { actuators, append, change, remove }
})