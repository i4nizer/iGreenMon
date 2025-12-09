import { initEmail, loopEmail } from "~~/server/services/email"
import { setTimeout } from "timers/promises"

//

export default defineNitroPlugin(async (nitro) => {
    // --- Wait for the database
    while (!nitro.sequelize) await setTimeout(5000)
    
    // --- Configure and run
    const config = useRuntimeConfig()
    const isProd = config.nodeEnv == "production"
    await initEmail(config.gmailAddress, config.gmailPassword)
        .then(() => !isProd && console.info("Email service verified."))
        .catch(console.error)
        
    setInterval(() => loopEmail(), 5000)
    if (!isProd) console.info("Email service running.")
})