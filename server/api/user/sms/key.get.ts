import { Token } from "~~/server/models/token"
import { createToken } from "~~/server/services/token"

//

export default defineEventHandler(async (event) => {
    // --- Get user then respond with user sms key
    const userId = event.context.accessTokenPayload.id
    let token = await Token.findOne({ where: { type: "Sms", userId } })
    
    // --- Respond emmidiately if there is token
    if (token) return token.value

    // --- No token the create and send
    const value = createToken({ id: userId }, "Sms")
    token = await Token.create({
        type: "Sms",
        value,
        userId,
    })

    return token.value
})

