import api from "./api"
import bridger from "./bridger"
import emitter from "./emitter"
import hook from "./hook"
import log from "./log"
import registry from "./registry"
import syncer from "./syncer"
import websocket from "./websocket"

//

let busy = false

const init = () => {
    syncer.init()
    bridger.init()
    emitter.init()
}

// --- Handles continuously queueing user logs
const loop = () => {
    if (busy) return
    busy = true
    
    for (const [uid, lset] of registry.logs) {
        const queued = log.pool.logs.has(uid)
        if (queued) continue

        // --- Queue one log from user
        for (const lid of lset) {
            log.pool.queue(uid, lid)
            break
        }
    }

    busy = false
}

//

export default { init, loop, registry, api, hook, websocket }
