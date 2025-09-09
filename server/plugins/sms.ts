import sms from "../services/sms"

//

export default defineNitroPlugin(() => {
    // --- Initialize and run
    sms.init()
    console.info(`Sms service initialized.`)
    setInterval(() => sms.loop(), 500)
    console.info(`Sms service running.`)
})