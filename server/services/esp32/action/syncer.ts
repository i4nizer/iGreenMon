import { ActionItem } from "./schema";
import { ActionStatus } from "~~/shared/schema/action";
import { Action as ActionModel } from "~~/server/models/action";
import event from "./event";

//

const onUpdateAction = async (action: Readonly<ActionItem>) => {
    const { id, status } = action
    await ActionModel.update(
        { status },
        { where: { id } },
    )
}

//

const init = () => {
    event.listen("Active", onUpdateAction)
    event.listen("Delayed", onUpdateAction)
    event.listen("Discarded", onUpdateAction)
    event.listen("Inactive", onUpdateAction)
    event.listen("Interrupted", onUpdateAction)
    event.listen("Timeout", onUpdateAction)

    console.info(`Action syncer initialized.`)
}

//

export default { init }
