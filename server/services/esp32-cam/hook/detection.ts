import { Detection } from "~~/shared/schema/detection";
import { HookHandler } from "./type";

//

const chooks: HookHandler<Detection>[] = []

//

const onCreate = (hook: HookHandler<Detection>) => chooks.push(hook)

//

const create = (data: Detection) => chooks.forEach((h) => h(data))

//

export default { create, onCreate }
