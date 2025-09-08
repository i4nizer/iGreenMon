import z from "zod"
import jwt from "jsonwebtoken"
import esp32Cam from "~~/server/services/esp32-cam"
import { Token } from "~~/server/models/token"
import { setTimeout } from "timers/promises"
import { createToken, safeVerifyToken } from "~~/server/services/token"
import { Esp32Cam } from "~~/server/models/esp32-cam"

//

const PayloadSchema = z.object({
    id: z.coerce.number().int(),
    esp32CamId: z.coerce.number().int(),
})

//

export default defineWebSocketHandler({
    upgrade: (request) => {
        const key = request.headers.get("x-api-key")
        if (!key) return console.warn(`Esp32Cam tried to connect without api key.`)
        
        // --- Attach meta
        request.context.esp32CamToken = key
        request.context.esp32CamTokenPayload = jwt.decode(key)
        
        // --- Verify
        const res = safeVerifyToken(key, "Esp32Cam")
        if (!res.success) {
            // --- Can be valid but expired
            const expired = res.error instanceof jwt.TokenExpiredError
            request.context.esp32CamTokenExpired = expired
            return console.warn(`Esp32Cam provided invalid api key.`)
        }
    },
    open: async (peer) => {
        peer.send("Welcome to Greenmon!")
		await setTimeout(1000)

		// --- Validate payload
		const payload = peer.context.esp32CamTokenPayload as any
		const res = PayloadSchema.safeParse(payload)
		if (!res.success) return peer.close(1000, "Invalid token payload.")

		// --- Check if expired
		if (peer.context.esp32CamTokenExpired) {
			// --- Find esp32Cam
			const esp32Cam = await Esp32Cam.findOne({
				where: { id: res.data.esp32CamId },
				attributes: ["tokenId"],
			})
			if (!esp32Cam) return peer.close(1000, "Unregistered esp32Cam.")

			// --- Find or create token
			const token = createToken(res.data, "Esp32Cam")
			await Token.findOrCreate({
				defaults: {
					type: "Esp32Cam",
					value: token,
					userId: res.data.id,
				},
				where: { id: esp32Cam.dataValues.tokenId },
				attributes: ["id"],
			})

			// --- Send token and terminate
			const event = {
				data: [{ token }],
				event: "error",
				query: "Create",
			}

			peer.send(JSON.stringify(event))
			await setTimeout(2000)
			return peer.close(1000, "Renewed token.")
		}

		// --- Register esp32Cam to the service
		const esp32CamModel = await Esp32Cam.findByPk(res.data.esp32CamId)
		if (!esp32CamModel) return peer.close(1000, "Unregistered esp32Cam.")

        await esp32Cam.registry.register(peer, esp32CamModel.dataValues)
        peer.send(JSON.stringify({ data: [], event: "auth", query: "Create" }))
        await setTimeout(250)
        peer.send(JSON.stringify({ data: [esp32CamModel.dataValues], event: "camera", query: "Create" }))
        await setTimeout(250)
        peer.send(JSON.stringify({ data: [], event: "init", query: "Create" }))
		console.info(`Esp32Cam ${peer.id} ${esp32CamModel.name} connected.`)
    },
	message: async (peer, message) => {
        await esp32Cam.websocket.hear(peer, message)
    },
    error: (peer, error) => {
		console.error(error)
    },
    close: async (peer, details) => {
		await esp32Cam.registry.unregister(peer.id)
		console.info(`Esp32Cam ${peer.id} disconnected.`)
    },
})