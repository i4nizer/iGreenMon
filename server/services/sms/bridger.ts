import log from "./log";
import event from "./event";
import { Log } from "~~/shared/schema/log";
import { WebSocketEventHandler } from "./schema";

//

const onUpdateLog: WebSocketEventHandler<Log> = (peer, data, user) => {
    for (const l of data) {
        if (!l.messaged) continue
        for (const [uid, lid] of log.pool.logs) {
            if (lid != l.id) continue
            log.pool.dequeue(uid)
        }
    }
}

//

const init = () => {
    event.listen("log", "Update", onUpdateLog)
    console.info(`Sms bridger initialized.`)
}

//

export default { init }
