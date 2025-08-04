import { initEmail, loopEmail } from "~~/server/services/email"

//

export default defineNitroPlugin(async () => {
    // --- Configure and run
    const config = useRuntimeConfig()
    const isProd = config.nodeEnv == "production"
    await initEmail(config.gmailAddress, config.gmailPassword)
        .then(() => !isProd && console.info("Email service verified."))
        .catch(console.error)
        
    setInterval(() => loopEmail(), 500)
    if (!isProd) console.info("Email service running.")
})