import type { Pin } from "~~/shared/schema/pin"

//

export const usePinStore = defineStore("pin", () => {
    // --- Data
    const pins = reactive<Pin[]>([])

    // --- These applies dedups
    const append = (pin: Pin) => {
        const idx = pins.findIndex((g) => g.id == pin.id)
        if (idx != -1) pins.splice(idx, 1, pin)
        else pins.push(pin)
    }

    const change = (pin: Pin) => {
        const idx = pins.findIndex((g) => g.id == pin.id)
        if (idx != -1) pins.splice(idx, 1, pin)
    }

    const remove = (id: number) => {
        const filtered = pins.filter((g) => g.id != id)
        pins.splice(0, pins.length)
        pins.push(...filtered)
    }

    // --- Expose
    return { pins, append, change, remove }
})