import { Reading } from "~~/shared/schema/reading"
import { HookHandler } from "./type"

//

const chooks: HookHandler<Reading>[] = []

//

const onCreate = (hook: HookHandler<Reading>) => chooks.push(hook)

//

const create = (reading: Reading) => chooks.forEach((h) => h(reading))

//

export default { onCreate, create }
