import log from "../services/log"
import { setTimeout } from "timers/promises"

//

export default defineNitroPlugin(async () => {
    // --- Run after db init
    await setTimeout(30000)
    console.info(`Log emailing service running.`)
    setInterval(() => log.loop(), 5000)
})