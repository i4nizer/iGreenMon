import { Threshold } from "~~/shared/schema/threshold"
import { HookHandler } from "./type"

//

const uhooks: HookHandler<Threshold>[] = []

//

const onUpdate = (hook: HookHandler<Threshold>) => uhooks.push(hook)

//

const update = (threshold: Threshold) => uhooks.forEach((h) => h(threshold))

//

export default { onUpdate, update }
