import esp32Cam from "~~/server/services/esp32-cam"
import { setTimeout } from "timers/promises"

//

export default defineNitroPlugin(async (nitro) => {
    // --- Wait for the database
    while (!nitro.sequelize) await setTimeout(5000)
    
    // --- Initialize and run
    esp32Cam.init()
    console.info("Esp32Cam websocket service initialized.")
})
