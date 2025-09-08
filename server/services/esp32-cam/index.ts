import api from "./api"
import hook from "./hook"
import registry from "./registry"
import syncer from "./syncer"
import websocket from "./websocket"

//

const init = () => {
    syncer.init()
}

//

export default { init, registry, hook, websocket, api }
