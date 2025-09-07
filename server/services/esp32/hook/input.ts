import { Input } from "~~/shared/schema/input"
import { HookHandler } from "./type"

//

const uhooks: HookHandler<Input>[] = []

//

const onUpdate = (hook: HookHandler<Input>) => uhooks.push(hook)

//

const update = (input: Input) => uhooks.forEach((h) => h(input))

//

export default { onUpdate, update }
