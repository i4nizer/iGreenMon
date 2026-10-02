import { v2 as cloudinary } from "cloudinary"
import { cloudinaryConfig } from "./config"
import { uploadImageAsync, fetchImageAsync } from "./util"
import type { CloudinaryConfig } from "./type"

//

/** Configures the Cloudinary account used to store images. */
const initCloudinary = async (account: CloudinaryConfig) => {
	const missing = Object.entries(account).filter(([, v]) => !v).map(([k]) => k)
	if (missing.length > 0) throw Error(`Cloudinary service is missing config: ${missing.join(", ")}.`)

	cloudinary.config({
		cloud_name: account.cloudName,
		api_key: account.apiKey,
		api_secret: account.apiSecret,
		secure: true,
	})

	cloudinaryConfig.account = { ...account, folder: account.folder.replace(/^\/+|\/+$/g, "") }
	return true
}

//

export { initCloudinary, uploadImageAsync, fetchImageAsync }
