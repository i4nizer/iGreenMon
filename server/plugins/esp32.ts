import esp32 from "~~/server/services/esp32"

//

export default defineNitroPlugin(async () => {
    // --- Initialize and run
    esp32.init()
    setInterval(() => esp32.loop(), 250)
    console.info("Esp32 websocket service runnning.")
})
