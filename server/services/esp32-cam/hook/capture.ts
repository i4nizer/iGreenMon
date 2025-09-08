import { Capture } from "~~/shared/schema/capture";
import { HookHandler } from "./type";

//

const chooks: HookHandler<Capture>[] = []

//

const onCreate = (hook: HookHandler<Capture>) => chooks.push(hook)

//

const create = (data: Capture) => chooks.forEach((h) => h(data))

//

export default { create, onCreate }
