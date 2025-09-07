import bridger from "./bridger"
import emitter from "./emitter"
import handler from "./handler"
import reading from "./reading"
import registry from "./registry"
import syncer from "./syncer"
import websocket from "./websocket"
import action from "./action"
import linker from "./linker"
import schedule from "./schedule"
import api from "./api"
import hook from "./hook"

//

let busy = false

//

const init = () => {
	bridger.init()
	emitter.init()
	handler.init()
	linker.init()
	syncer.init()
}

const loop = () => {
	if (busy) return
	busy = true
	reading.loop()
	action.loop()
	schedule.loop()
	busy = false
}

//

export default { init, loop, registry, websocket, api, hook }
