import { initCloudinary } from "~~/server/services/cloudinary"

//

export default defineNitroPlugin(async (nitro) => {
	// --- Configure, no database needed
	const config = useRuntimeConfig()
	const isProd = config.nodeEnv == "production"
	await initCloudinary({
		cloudName: config.cloudinaryCloudName,
		apiKey: config.cloudinaryApiKey,
		apiSecret: config.cloudinaryApiSecret,
		folder: config.cloudinaryFolder,
	})
		.then(() => !isProd && console.info("Cloudinary service configured."))
		.catch(console.error)
})
