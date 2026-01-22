import adapter from "../services/adapter"
import { setTimeout } from "timers/promises"

//

export default defineNitroPlugin(async (nitro) => {
    // --- Wait for the database
    while (!nitro.sequelize) await setTimeout(5000)
    
    // --- Initialize links
    adapter.init()
    console.info(`Adapter initialized.`)
})