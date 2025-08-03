import type { EmailQueueItem, EmailQueueItemCallback } from "./type"
import { emailConfig } from "./config"
import { sendEmailQueueItemAsync } from "./util"

//

const emailQueue: EmailQueueItem[] = []
let emailQueueBusy = false

//

/** Ensures email is sent. */
const queueEmail = (
	to: string,
	subject: string,
	text?: string,
	html?: string,
	callback?: EmailQueueItemCallback
) => {
	emailQueue.push({ to, subject, text, html, callback })
}

/** Sends a queued email. */
const loopEmailQueue = async () => {
    const { transporter } = emailConfig
	if (!transporter) throw Error("Email service has no transporter.")
	if (emailQueue.length <= 0 || emailQueueBusy) return

	// --- Get email and mark as busy
	const email = emailQueue.shift() as EmailQueueItem
	emailQueueBusy = true

	// --- Promise wrapped email sending
    await sendEmailQueueItemAsync(email, transporter)
        .catch(() => emailQueue.unshift(email))

	emailQueueBusy = false
}

//

export { queueEmail, loopEmailQueue }
