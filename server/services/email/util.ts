import type { SentMessageInfo, Transporter, SendMailOptions } from "nodemailer"
import type { EmailQueueItem, EmailQueueItemCallback } from "./type"
import type { Options } from "nodemailer/lib/smtp-transport"

//

/** Invokes the EmailQueueItem's callback. */
const sendEmailQueueItemAsync = (
	emailQueueItem: EmailQueueItem,
	emailTransporter: Transporter<SentMessageInfo, Options>
): Promise<SentMessageInfo> =>
	new Promise((resolve, reject) => {
		// --- Attach internal callback and deter state
		const callback: EmailQueueItemCallback = (err, info) => {
			if (emailQueueItem.callback) emailQueueItem.callback(err, info)
			return err ? reject(err) : resolve(info)
		}

		// --- Send it
		emailTransporter.sendMail(emailQueueItem as SendMailOptions, callback)
	})

//

export { sendEmailQueueItemAsync }
