import { initEmail, loopEmail } from "~~/server/services/email"

//

export default defineNitroPlugin(() => {
    // --- Configure and run
    const config = useRuntimeConfig()
    initEmail(config.gmailAddress, config.gmailPassword)
    setInterval(() => loopEmail(), 500)
})