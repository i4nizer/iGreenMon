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
    const { archmail } = emailConfig
	if (!archmail) throw Error("Email service is not configured.")
	if (emailQueue.length <= 0 || emailQueueBusy) return

	// --- Get email and mark as busy
	const email = emailQueue.shift() as EmailQueueItem
	emailQueueBusy = true

    // --- Re-queue unless Archmail rejected the email as invalid
    await sendEmailQueueItemAsync(email, archmail)
        .catch((err) => err?.statusCode !== 400 && emailQueue.unshift(email))

	emailQueueBusy = false
}

//

export { queueEmail, loopEmailQueue }
