import adapter from "../services/adapter"

//

export default defineNitroPlugin(async () => {
    // --- Initialize links
    adapter.init()
    console.info(`Adapter initialized.`)
})