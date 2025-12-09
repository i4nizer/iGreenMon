import { NPKModel } from "~~/server/services/model"
import { setTimeout } from "timers/promises"

//

export default defineNitroPlugin(async (nitro) => {
	// --- Wait for the database
	while (!nitro.sequelize) await setTimeout(5000)

	// --- Configure and run
	const config = useRuntimeConfig()
	const isProd = config.nodeEnv == "production"
	
    await NPKModel.load()
	if (!isProd) console.info("NPK detection model loaded.")
		
	await NPKModel.predict(`${process.cwd()}/storage/image/lettuce.jpg`)
	if (!isProd) console.info("NPK detection model warmed up.")
})
