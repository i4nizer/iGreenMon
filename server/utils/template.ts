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

//

const renderTemplate = async (template: Template) => {
	const { type, data } = template
	const filepath = `${process.cwd()}/templates/${type.toLowerCase()}.ejs`
	return await ejs.renderFile(filepath, data)
}

//

const safeRenderTemplate = async (
	template: Template
): Promise<SafeResult<string, Error>> => {
	try {
		const { type, data } = template
		const filepath = `${process.cwd()}/templates/${type.toLowerCase()}.ejs`
		const result = await ejs.renderFile(filepath, data)
		return { success: true, data: result }
	} catch (error) {
		return { success: false, error: error as Error }
	}
}

//

export { type Template, renderTemplate, safeRenderTemplate }
