import { Condition } from "~~/shared/schema/condition"
import { HookHandler } from "./type"

//

const uhooks: HookHandler<Condition>[] = []

//

const onUpdate = (hook: HookHandler<Condition>) => uhooks.push(hook)

//

const update = (condition: Condition) => uhooks.forEach((h) => h(condition))

//

export default { onUpdate, update }
