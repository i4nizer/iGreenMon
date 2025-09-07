import data from "~~/server/services/data"
import cookie from "cookie"
import { safeVerifyToken } from "~~/server/services/token"
import { User as UserModel } from "~~/server/models/user"
//

export default defineWebSocketHandler({
    upgrade: (request) => {
        // --- Check access token
        const cookies = cookie.parse(request.headers.get("cookie") || "")
        const accessToken = cookies["access-token"]
        if (!accessToken) return
        
        // --- Verify access token
        const res = safeVerifyToken(accessToken, "Access")
        if (!res.success) return

        // --- Attach meta
        request.context.accessToken = accessToken
        request.context.accessTokenPayload = res.data
    },
    open: async (peer) => {
        // --- No access token == unauth
        if (!peer.context.accessToken) return peer.close()
        
        // --- Register websocket user
        const userId = (peer.context.accessTokenPayload as any).id as number
        const user = await UserModel.findOne({
            where: { id: userId },
            attributes: ["id", "name", "verified", "disabled"],
        })
        
        if (!user) return peer.close(1000, "Unregistered user.")
        console.info(`Data ${user.name} connected.`)
        data.registry.register(peer, user)
    },
    message: (peer, message) => {
        data.websocket.hear(peer, message)
    },
    error: (peer, error) => {
        console.error(error)
    },
    close: (peer, details) => {
        console.warn(`Data ${peer.id} disconnected.`, details)
        data.registry.unregister(peer.id)
    },
})