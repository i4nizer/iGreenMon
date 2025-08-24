import type { Input } from "~~/shared/schema/input"

//

export const useInputStore = defineStore("input", () => {
    // --- Data
    const inputs = reactive<Input[]>([])

    // --- These applies dedups
    const append = (input: Input) => {
        const idx = inputs.findIndex((i) => i.id == input.id)
        if (idx != -1) inputs.splice(idx, 1, input)
        else inputs.push(input)
    }

    const change = (input: Input) => {
        const idx = inputs.findIndex((i) => i.id == input.id)
        if (idx != -1) inputs.splice(idx, 1, input)
    }

    const remove = (id: number) => {
        const filtered = inputs.filter((i) => i.id != id)
        inputs.splice(0, inputs.length)
        inputs.push(...filtered)
    }

    // --- Expose
    return { inputs, append, change, remove }
})