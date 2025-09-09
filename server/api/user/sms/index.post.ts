import sms from "~~/server/services/sms"
import { SmsSchema } from "#shared/schema/sms"

//

export default defineEventHandler(async (event) => {
    // --- Parse body
    const body = await readBody(event)
    const bodyResult = SmsSchema.safeParse(body)

    if (!bodyResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: bodyResult.error.message,
        })
    }

    const userId = event.context.accessTokenPayload.id
    const { phone, message } = bodyResult.data
    sms.api.sms.create(userId, phone, message)

    return sendNoContent(event)
})