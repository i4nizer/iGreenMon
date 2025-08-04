import nodemailer from "nodemailer"
import { emailConfig } from "./config"
import { queueEmail, loopEmailQueue } from "./queue"

//

/** Initializes the nodemailer.transporter. */
const initEmail = async (emailAddress: string, emailPassword: string) => {
    emailConfig.transporter = nodemailer.createTransport({
        auth: {
            user: emailAddress,
            pass: emailPassword,
        },
        secure: true,
        service: "gmail",
    })
    return await emailConfig.transporter.verify()
}

/** Must be called in an interval. */
const loopEmail = async () => await loopEmailQueue()

//

export { initEmail, loopEmail, queueEmail }