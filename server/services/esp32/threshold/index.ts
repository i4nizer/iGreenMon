import event from "./event"
import syncer from "../syncer"
import registry from "./registry"
import evaluator from "./evaluator"
import condition from "./condition"
import * as schema from "./schema"

//

const init = () => {
    syncer.init()
}

//

export default { init, event, syncer, schema, registry, evaluator, condition }
