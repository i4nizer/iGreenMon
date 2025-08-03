import type { SendMailOptions, SentMessageInfo } from "nodemailer"

//

type EmailQueueItem = SendMailOptions & { callback?: EmailQueueItemCallback }

type EmailQueueItemCallback = (err: Error | null, info: SentMessageInfo) => any

//

export type { EmailQueueItem, EmailQueueItemCallback }
