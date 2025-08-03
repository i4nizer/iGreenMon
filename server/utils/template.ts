import ejs from "ejs"
import { SafeResult } from "~~/shared/types/safe-result"

//

type TemplateType =
	| "Verification"
	| "Verification-Success"
	| "Reset-Password"
	| "Reset-Password-Success"

//

const renderTemplate = async (template: TemplateType, data: ejs.Data) => {
	const filepath = `${process.cwd()}/templates/${template.toLowerCase()}.ejs`
	return await ejs.renderFile(filepath, data)
}

//

const safeRenderTemplate = async (
	template: TemplateType,
	data: ejs.Data
): Promise<SafeResult<string, Error>> => {
	try {
		const filepath = `${process.cwd()}/templates/${template.toLowerCase()}.ejs`
		const result = await ejs.renderFile(filepath, data)
		return { data: result, error: undefined, success: true }
	} catch (error) {
		return { data: undefined, error: error as Error, success: false }
	}
}

//

export { type TemplateType, ejs, renderTemplate, safeRenderTemplate }
