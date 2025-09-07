import { Action } from "~~/shared/schema/action"
import { HookHandler } from "./type"

//

const uhooks: HookHandler<Action>[] = []

//

const onUpdate = (hook: HookHandler<Action>) => uhooks.push(hook)

//

const update = (action: Action) => uhooks.forEach((h) => h(action))

//

export default { onUpdate, update }
