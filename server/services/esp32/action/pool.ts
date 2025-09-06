import event from "./event"
import { ActionItem } from "./schema"

//

// --- Action Queue
const actions = new Map<number, ActionItem>() // ActionItem.id => ActionItem
const birthcert = new Map<number, number>() // ActionItem.id => timequeued

//

const queue = (action: ActionItem) => {
	actions.set(action.id, action)
    birthcert.set(action.id, Date.now())
	console.info(`Action ${action.id} queued.`)
}

const dequeue = (aid: number) => {
	let res = actions.delete(aid)
	res = res && birthcert.delete(aid)
	if (res) console.info(`Action ${aid} dequeued.`)
}

//

export default {
    actions,
	birthcert,
	queue,
	dequeue,
}
