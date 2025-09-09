import z from "zod"
import log from "./log"
import event from "./event"
import { LogSchema } from "~~/shared/schema/log"
import { WebSocketEventHandler } from "./schema"
import { Log as LogModel } from "~~/server/models/log"
import hook from "./hook"

//

const LogUpdateSchema = LogSchema.pick({
    id: true,
    messaged: true,
    userId: true,
})
type LogUpdate = z.infer<typeof LogUpdateSchema>

//

const onUpdateLog: WebSocketEventHandler<LogUpdate> = async (peer, data, user) => {
	const promises = []
    for (const l of data) {
		if (!l.messaged) continue
        
        const lres = LogUpdateSchema.safeParse(l)
        if (!lres.success) continue
        
        const promise = LogModel
            .findByPk(l.id)
            .then(async (l) => await l?.update({ messaged: l.messaged }))
            .then((l) => { if (l) hook.log.update(l) })
        promises.push(promise)
    }
    await Promise.all(promises).catch(console.error)
}

//

const init = () => {
	event.listen("log", "Update", onUpdateLog)
	console.info(`Sms bridger initialized.`)
}

//

export default { init }
