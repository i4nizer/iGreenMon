import z from "zod"
import jwt from "jsonwebtoken"
import esp32 from "~~/server/services/esp32"
import { Esp32 } from "~~/server/models/esp32"
import { Token } from "~~/server/models/token"
import { setTimeout } from "timers/promises"
import { createToken, safeVerifyToken } from "~~/server/services/token"

//

const PayloadSchema = z.object({
    id: z.coerce.number().int(),
    esp32Id: z.coerce.number().int(),
})

//

export default defineWebSocketHandler({
	upgrade: async (request) => {
		const key = request.headers.get("x-api-key")
		if (!key) return console.warn(`Esp32 tried to connect without api key.`)
        
        // --- Attach meta
        request.context.esp32Token = key
        request.context.esp32TokenPayload = jwt.decode(key)
        
        // --- Verify
        const res = safeVerifyToken(key, "Esp32")
        if (!res.success) {
            // --- Can be valid but expired
            const expired = res.error instanceof jwt.TokenExpiredError
            request.context.esp32TokenExpired = expired
            return console.warn(`Esp32 provided invalid api key.`)
        }
	},
    open: async (peer) => {
        peer.send("Welcome to Greenmon!")
        await setTimeout(1000)

        // --- Validate payload
        const payload = peer.context.esp32TokenPayload as any
        const res = PayloadSchema.safeParse(payload)
        if (!res.success) return peer.close(1000, "Invalid token payload.")
        
        // --- Check if expired
        if (peer.context.esp32TokenExpired) {
            // --- Find esp32
            const esp32 = await Esp32.findOne({
                where: { id: res.data.esp32Id },
                attributes: ["tokenId"],
            })
            if (!esp32) return peer.close(1000, "Unregistered esp32.")
            
            // --- Find or create token
            const token = createToken(res.data, "Esp32")
            await Token.findOrCreate({
                defaults: {
                    type: "Esp32",
                    value: token,
                    userId: res.data.id,
                },
                where: { id: esp32.dataValues.tokenId },
                attributes: ["id"],
            })
            
            // --- Send token and terminate
			const event = {
				data: [{ token }],
				event: "token",
				query: "Create",
            }

            peer.send(JSON.stringify(event))
            await setTimeout(2000)
			return peer.close(1000, "Renewed token.")
        }

        // --- Register esp32 to the service
        const esp32Model = await Esp32.findByPk(res.data.esp32Id)
        if (!esp32Model) return peer.close(1000, "Unregistered esp32.")
        
		await esp32.registry.register(peer, esp32Model.dataValues)
        console.info(`Esp32 ${peer.id} ${esp32Model.name} connected.`)
        esp32.websocket.talk(peer.id, [], "auth", "Create")
    },
    message: async (peer, message) => {
        esp32.websocket.hear(peer, message)
    },
    error: (peer, error) => {
        console.error(error)
    },
    close: async (peer, details) => {
        await esp32.registry.unregister(peer)
        console.warn(`Esp32 ${peer.id} disconnected.`, details)
    }
})
