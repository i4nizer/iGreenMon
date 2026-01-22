import log from "../services/log"
import { setTimeout } from "timers/promises"

//

export default defineNitroPlugin(async (nitro) => {
	// --- Wait for the database
    while (!nitro.sequelize) await setTimeout(5000)
    
	// --- Run after db init
	console.info(`Log emailing service running.`)
	setInterval(() => log.loop(), 30000)
})