//

type EmailQueueItem = {
	to: string
	subject: string
	text?: string
	html?: string
	callback?: EmailQueueItemCallback
}

type EmailQueueItemCallback = (err: Error | null, info: unknown) => any

/** Connection and sender details for the Archmail microservice. */
type ArchmailConfig = {
	url: string
	apikey: string
	gmailAddress: string
	gmailPassword: string
}

//

export type { EmailQueueItem, EmailQueueItemCallback, ArchmailConfig }
