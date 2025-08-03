import type SMTPTransport from "nodemailer/lib/smtp-transport"
import nodemailer, { type SentMessageInfo } from "nodemailer"

//

const emailConfig = {
	transporter: undefined as
		| nodemailer.Transporter<SentMessageInfo, SMTPTransport.Options>
		| undefined,
}

//

export { emailConfig }
