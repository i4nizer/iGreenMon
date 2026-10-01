import fs from "fs"
import path from "path"

//

/** Serves the browser-side LiteRT model, only .tflite files are exposed. */
export default defineEventHandler(async (event) => {
	// --- Only allow plain .tflite file names
	const file = path.basename(getRouterParam(event, "file") ?? "")
	if (!file.endsWith(".tflite")) {
		throw createError({ statusCode: 404, statusMessage: "Model not found." })
	}

	// --- Check existence
	const filepath = `${process.cwd()}/storage/model/npk/${file}`
	const stat = await fs.promises.stat(filepath).catch(() => undefined)
	if (!stat?.isFile()) throw createError({ statusCode: 404, statusMessage: "Model not found." })

	// --- Stream the model
	setHeader(event, "Content-Type", "application/octet-stream")
	setHeader(event, "Content-Length", stat.size)
	setHeader(event, "Cache-Control", "public, max-age=3600")
	return sendStream(event, fs.createReadStream(filepath))
})
