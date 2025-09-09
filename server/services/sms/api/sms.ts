import registry from "../registry"
import websocket from "../websocket"

//

const create = (uid: number, phone: string, message: string) => {
    for (const [pid, user] of registry.users) {
        if (user.id != uid) continue
        websocket.talk(pid, [{ phone, message }], "sms", "Create")
    }
}

//

export default { create }
