import fs from "fs/promises"
import { createReadStream } from "fs"
import { Capture } from "~~/server/models/capture"
import { Esp32Cam } from "~~/server/models/esp32-cam"
import { hasPermission } from "~~/server/services/greenhouse/crew/permission"

//

export default defineEventHandler(async (event) => {
    // --- Get filename from params
    const { filename } = getRouterParams(event)

    // --- Check path
    const path = `${process.cwd()}/storage/capture/${filename}`
    
    const exists = await fs
        .access(path)
        .then(() => true)
        .catch(() => false)

    if (!exists) {
        throw createError({
            statusCode: 404,
            statusMessage: "Capture not found.",
        })
    }

    // --- Trace greenhouseId
    const userId = event.context.accessTokenPayload.id
    const capture = await Capture.findOne({
        where: { filename },
        include: [
            {
                model: Esp32Cam,
                as: "esp32Cam",
                required: true,
                attributes: ["greenhouseId"],
            },
        ],
        attributes: ["id"],
    })

    if (!capture) {
        throw createError({
            statusCode: 404,
            statusMessage: "Capture not found.",
        })
    }

    // --- Check permission
    const greenhouseId = (capture as any).esp32Cam.greenhouseId as number
    
    const permResult = await hasPermission(
        "Retrieve",
        "Capture",
        userId,
        greenhouseId
    )

    if (!permResult.success) {
        const error = permResult.success
			? "User doesn't have permission."
			: permResult.error
		throw createError({
			statusCode: 400,
			statusMessage: error,
		})
    }

    // --- Send the capture image
    setHeader(event, "Content-Type", "application/octet-stream")
    return createReadStream(path)
})