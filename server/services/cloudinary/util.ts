import { v2 as cloudinary } from "cloudinary"
import type { UploadApiResponse } from "cloudinary"
import { cloudinaryConfig } from "./config"

//

/** Images are private, only reachable through signed urls. */
const deliveryType = "authenticated"

//

/** Maps a stored filename (e.g. 1759300000000.jpg) to its public id. */
const toPublicId = (filename: string) => {
	const { account } = cloudinaryConfig
	if (!account) throw Error("Cloudinary service is not configured.")
	return `${account.folder}/${filename.replace(/\.[^/.]+$/, "")}`
}

/** Uploads the image under the configured folder, named after the filename. */
const uploadImageAsync = (
	image: Buffer,
	filename: string
): Promise<UploadApiResponse> => {
	const public_id = toPublicId(filename)

	return new Promise((resolve, reject) => {
		const options = { public_id, type: deliveryType, resource_type: "image" as const, overwrite: false }
		const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
			if (error || !result) return reject(error ?? Error("Cloudinary returned no result."))
			resolve(result)
		})
		stream.end(image)
	})
}

/** Downloads the image through a signed delivery url. */
const fetchImageAsync = async (filename: string): Promise<Buffer> => {
	const url = cloudinary.url(toPublicId(filename), {
		type: deliveryType,
		resource_type: "image",
		format: "jpg",
		sign_url: true,
		secure: true,
	})

	const image = await $fetch<ArrayBuffer>(url, { responseType: "arrayBuffer" })
	return Buffer.from(image)
}

//

export { toPublicId, uploadImageAsync, fetchImageAsync }
