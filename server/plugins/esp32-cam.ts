import esp32Cam from "~~/server/services/esp32-cam"

//

export default defineNitroPlugin(async () => {
    // --- Initialize and run
    esp32Cam.init()
    console.info("Esp32Cam websocket service initialized.")
})
