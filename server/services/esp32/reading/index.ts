import hook from "./hook"
import event from "./event"
import output from "./output"
import * as schema from "./schema"
import reader from "./reader"
import registry from "./registry"
import syncer from "./syncer"

//

const init = () => {
    syncer.init()
}

const loop = () => {
    hook.loop()
    output.loop()
    reader.loop()
}

//

export default { init, loop, hook, event, output, schema, reader, registry }
