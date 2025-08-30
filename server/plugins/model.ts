import { NPKModel } from "~~/server/services/model"

//

export default defineNitroPlugin(async () => {
	// --- Configure and run
	const config = useRuntimeConfig()
	const isProd = config.nodeEnv == "production"
	
    await NPKModel.load()
	if (!isProd) console.info("NPK detection model loaded.")
})
