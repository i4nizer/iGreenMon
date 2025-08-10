import { isGHNameAvailable } from "~~/server/services/greenhouse"

//

export default defineEventHandler(async (event) => {
    // --- Get name from params
    const { ghname } = getRouterParams(event, { decode: true })
    
    // --- Count greenhouse with same name relative to user
    const userId = event.context.accessTokenPayload.id
    const checkResult = await isGHNameAvailable(ghname, userId)
    if (!checkResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: checkResult.error,
        })
    }
    
    // --- Return state
    return checkResult.data
})