import { Log } from "~~/shared/schema/log";
import registry from "../registry";

//

const create = (log: Log) => {
    if (log.messaged) return
    const lset = registry.logs.get(log.userId)
    if (lset) lset.add(log.id)
}

//

export default { create }
