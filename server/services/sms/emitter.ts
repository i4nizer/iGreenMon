import log from "./log";
import registry from "./registry";
import websocket from "./websocket";
import { Log as LogModel } from "~~/server/models/log"
import { LogEventListener } from "./log/schema";

//

const onQueueLog: LogEventListener = async (uid, lid) => {
    const log = await LogModel.findByPk(lid)
    if (!log) return console.warn(`Sms queued log ${lid} not found.`)
    
    for (const [pid, user] of registry.users) {
        if (user.id != log.userId) continue
        websocket.talk(pid, [log.dataValues], "log", "Create")
    }
}

const onTimeoutLog: LogEventListener = async (uid, lid) => {
    const log = await LogModel.findByPk(lid)
	if (!log) return console.warn(`Sms timedout log ${lid} not found.`)

	for (const [pid, user] of registry.users) {
		if (user.id != log.userId) continue
		websocket.talk(pid, [log.dataValues], "log", "Create")
	}
}

//

const init = () => {
    log.event.listen("Queue", onQueueLog)
    log.event.listen("Timeout", onTimeoutLog)
    console.log(`Sms emitter initialized.`)
}

//

export default { init }
