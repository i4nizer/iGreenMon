import sms from "../services/sms"
import { setTimeout } from "timers/promises"

//

export default defineNitroPlugin(async (nitro) => {
    // --- Wait for the database
    while (!nitro.sequelize) await setTimeout(5000)
    
    // --- Initialize and run
    sms.init()
    console.info(`Sms service initialized.`)
    
    setInterval(() => sms.loop(), 15000)
    console.info(`Sms service running.`)
})