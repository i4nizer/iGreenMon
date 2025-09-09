import { Log } from "~~/shared/schema/log"
import { HookHandler } from "./type"

//

const uhooks: HookHandler<Log>[] = []

//

const onUpdate = (hook: HookHandler<Log>) => uhooks.push(hook)

//

const update = (log: Log) => uhooks.forEach((h) => h(log))

//

export default { onUpdate, update }
