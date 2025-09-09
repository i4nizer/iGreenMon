import z from "zod"
import jwt from "jsonwebtoken"
import sms from "~~/server/services/sms"
import { setTimeout } from "timers/promises"
import { createToken, safeVerifyToken } from "~~/server/services/token"
import { Token } from "~~/server/models/token"
import { User } from "~~/server/models/user"

//

const PayloadSchema = z.object({ id: z.coerce.number().int() })

//

export default defineWebSocketHandler({
	upgrade: (request) => {
		const key = request.headers.get("x-api-key")
		if (!key) return console.warn(`Sms tried to connect without api key.`)

		// --- Attach meta
		request.context.smsToken = key
		request.context.smsTokenPayload = jwt.decode(key)

		// --- Verify
		const res = safeVerifyToken(key, "Sms")
		if (!res.success) {
			// --- Can be valid but expired
			const expired = res.error instanceof jwt.TokenExpiredError
			request.context.smsTokenExpired = expired
			return console.warn(`Sms provided invalid api key.`)
		}
	},
    open: async (peer) => {
        peer.send("Welcome to iGreenMon!")
		await setTimeout(1000)

		// --- Validate payload
		const payload = peer.context.smsTokenPayload as any
		const res = PayloadSchema.safeParse(payload)
		if (!res.success) return peer.close(1000, "Invalid token payload.")

		// --- Check if expired
		if (peer.context.smsTokenExpired) {
			// --- Find or create token
			const token = createToken(res.data, "Sms")
			const [tokenModel, created] = await Token.findOrCreate({
				defaults: {
					type: "Sms",
					value: token,
					userId: res.data.id,
				},
                where: {
                    type: "Sms",
                    userId: res.data.id,
                },
				attributes: ["id"],
			})

            // --- Send token and terminate
            await tokenModel.update({ value: token })
			const event = {
				data: [{ token }],
				event: "token",
				query: "Create",
			}

			peer.send(JSON.stringify(event))
			await setTimeout(500)
			return peer.close(1000, "Renewed token.")
        }
        
		// --- Find user
		const user = await User.findOne({
			where: { id: res.data.id },
			attributes: ["id", "name", "phone"],
		})
		if (!user) return peer.close(1000, `User not registered.`)

		// --- Register
		console.info(`Sms user ${user.name} connected.`)
		await sms.registry.register(peer, user.dataValues)
    },
    message: (peer, message) => {
        sms.websocket.hear(peer, message)
    },
	error: (peer, error) => {
		console.error(error)
	},
    close: (peer, details) => {
        console.info(`Sms ${peer.id} disconnected.`)
    },
})
