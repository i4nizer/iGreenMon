import type { Greenhouse } from "~~/shared/schema/greenhouse"

//

export const useGreenhouseStore = defineStore("greenhouse", () => {
    // --- Data
    const greenhouses = reactive<Greenhouse[]>([])

    // --- These applies dedups
    const append = (greenhouse: Greenhouse) => {
        const idx = greenhouses.findIndex((g) => g.id == greenhouse.id)
        if (idx != -1) greenhouses.splice(idx, 1, greenhouse)
        else greenhouses.push(greenhouse)
    }

    const change = (greenhouse: Greenhouse) => {
        const idx = greenhouses.findIndex((g) => g.id == greenhouse.id)
		if (idx != -1) greenhouses.splice(idx, 1, greenhouse)
    }

    const remove = (id: number) => {
        const filtered = greenhouses.filter((g) => g.id != id)
        greenhouses.splice(0, greenhouses.length)
        greenhouses.push(...filtered)
    }

    // --- Expose
    return { greenhouses, append, change, remove }
})