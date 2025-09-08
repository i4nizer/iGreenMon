import ejs from "ejs"
import { SafeResult } from "~~/shared/types/safe-result"

//

type Template =
	| { type: "Verification"; data: { name: string; link: string } }
	| { type: "Verification-Success"; data: { name: string } }
	| { type: "Reset-Password"; data: { name: string; link: string } }
	| { type: "Reset-Password-Success"; data: { name: string } }
	| { type: "Sign-In-Failed"; data: { name: string; timestamp?: Date } }
	| { type: "Sign-In-Success"; data: { name: string; timestamp?: Date } }
	| {
		type: "Invitation";
		data: {
			invitee: string;
			inviter: string;
			message: string;
			greenhouse: string;
		}
	} | {
		type:
			| "Invitation-Accepted" 
			| "Invitation-Declined" 
			| "Invitation-Cancelled"
		data: {
			invitee: string;
			inviter: string;
			greenhouse: string;
		}
	} | {
		type: "Crew-Removal-Notif"
		data: {
			crew: string;
			owner: string;
			greenhouse: string;
		}
	} | {
		type: "Threshold-Activated"
		data: {
			user: string
			threshold: string
			greenhouse: string
			conditions: {
				type: "Above" | "Equal" | "Below"
				value: number
				output: string
			}[]
		}
	}

//

const renderTemplate = async (template: Template) => {
	const { type, data } = template
	const cwd = process.cwd()
	const file = type.toLocaleLowerCase()
	const filepath = `${cwd}/templates/${file}.ejs`
	return await ejs.renderFile(filepath, data)
}

//

export const useTemplate = async <S extends boolean = false>(
	opts: Template & { safe?: S }
): Promise<S extends true ? SafeResult<string, Error> : string> => {
	if (opts.safe) {
		try {
			return { success: true, data: await renderTemplate(opts) } as any
		} catch (error) {
			return { success: false, error: error as Error } as any
		}
	}
	return renderTemplate(opts) as any
}