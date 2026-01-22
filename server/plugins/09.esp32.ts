import esp32 from "~~/server/services/esp32"
import { setTimeout } from "timers/promises"

//

export default defineNitroPlugin(async (nitro) => {
    // --- Wait for the database
    while (!nitro.sequelize) await setTimeout(5000)
    
    // --- Initialize and run
    esp32.init()
    setInterval(() => esp32.loop(), 1000)
    console.info("Esp32 websocket service runnning.")
})
