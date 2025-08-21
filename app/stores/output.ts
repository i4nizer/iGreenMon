import type { Output } from "~~/shared/schema/output"

//

export const useOutputStore = defineStore("output", () => {
    // --- Data
    const outputs = reactive<Output[]>([])

    // --- These applies dedups
    const append = (output: Output) => {
        const idx = outputs.findIndex((o) => o.id == output.id)
        if (idx != -1) outputs.splice(idx, 1, output)
        else outputs.push(output)
    }

    const change = (output: Output) => {
        const idx = outputs.findIndex((o) => o.id == output.id)
        if (idx != -1) outputs.splice(idx, 1, output)
    }

    const remove = (id: number) => {
        const filtered = outputs.filter((o) => o.id != id)
        outputs.splice(0, outputs.length)
        outputs.push(...filtered)
    }

    // --- Expose
    return { outputs, append, change, remove }
})