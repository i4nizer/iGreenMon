import { setTimeout } from "timers/promises"
import cloudflared from "../services/cloudflared"

//

export default defineNitroPlugin(async () => {
    // --- Init cloudflare tunnel
    await setTimeout(60000)
    await cloudflared.init("http://127.0.0.1:3000")
    console.info("Cloudflared service initialized.")
})