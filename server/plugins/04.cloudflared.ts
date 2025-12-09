import { setTimeout } from "timers/promises"
import cloudflared from "../services/cloudflared"

//

export default defineNitroPlugin(async (nitro) => {
	// --- Wait for the database
	while (!nitro.sequelize) await setTimeout(5000)
	
    // --- Init cloudflare tunnel
	await cloudflared.init("http://127.0.0.1:3000")
	console.info("Cloudflared service initialized.")
})