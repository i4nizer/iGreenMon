import { emailConfig } from "./config"
import { queueEmail, loopEmailQueue } from "./queue"
import type { ArchmailConfig } from "./type"

//

/** Configures the Archmail microservice used to deliver emails. */
const initEmail = async (archmail: ArchmailConfig) => {
    const missing = Object.entries(archmail).filter(([, v]) => !v).map(([k]) => k)
    if (missing.length > 0) throw Error(`Email service is missing config: ${missing.join(", ")}.`)

    emailConfig.archmail = { ...archmail, url: archmail.url.replace(/\/+$/, "") }
    return true
}

/** Must be called in an interval. */
const loopEmail = async () => await loopEmailQueue()

//

export { initEmail, loopEmail, queueEmail }
