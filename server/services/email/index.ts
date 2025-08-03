import nodemailer from "nodemailer"
import { emailConfig } from "./config"
import { queueEmail, loopEmailQueue } from "./queue"

//

/** Initializes the nodemailer.transporter. */
const initEmail = (emailAddress: string, emailPassword: string) => {
    emailConfig.transporter = nodemailer.createTransport({
        auth: {
            user: emailAddress,
            pass: emailPassword,
        }
    })
}

/** Must be called in an interval. */
const loopEmail = async () => await loopEmailQueue()

//

export { initEmail, loopEmail, queueEmail }