import hook from "./hook"
import event from "./event"
import output from "./output"
import * as schema from "./schema"
import reader from "./reader"
import registry from "./registry"

//

const loop = () => {
    hook.loop()
    output.loop()
    reader.loop()
}

//

export default { loop, hook, event, output, schema, reader, registry }
