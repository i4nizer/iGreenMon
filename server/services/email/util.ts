import type { ArchmailConfig, EmailQueueItem } from "./type"

//

/** Sends the EmailQueueItem through Archmail and invokes its callback. */
const sendEmailQueueItemAsync = async (
	emailQueueItem: EmailQueueItem,
	archmail: ArchmailConfig
): Promise<void> => {
	const { callback, to, subject, text, html } = emailQueueItem
	
	const url = `${archmail.url}/api/send`
	const headers = { Authorization: `Bearer ${archmail.apikey}` }
	const gmail = { address: archmail.gmailAddress, password: archmail.gmailPassword }
	const mail = { to, subject, text, html }
	let error: Error | null = null
	
	await $fetch(url, { method: "POST", headers, body: { gmail, mail }})
		.catch((err) => error = err)
	
	if (error) return callback?.(error as Error, undefined)
	if (error) throw error
	if (callback) callback(null, undefined)
}

//

export { sendEmailQueueItemAsync }
