import event from "./event"
import action from "./action"
import reading from "./reading"
import threshold from "./threshold"
import { Input, InputSchema } from "~~/shared/schema/input"
import { ReadingCreate, ReadingCreateSchema } from "~~/shared/schema/reading"
import { WebSocketEventHandler, WebSocketEventListener } from "./schema"

//

/**
 * - Dequeues outputs in reading
 * - Evaluates condition in threshold
 */
const onCreateReading: WebSocketEventHandler<ReadingCreate> = async (
	peer,
	data,
	esp32
) => {
	for (const r of data) {
		const res = ReadingCreateSchema.safeParse(r)
		if (!res.success) continue
		reading.output.dequeue(res.data.outputId)
		threshold.evaluator.evalcond(res.data)
	}
}

// --- Dequeues action
const onUpdateInput: WebSocketEventHandler<
	Pick<Input, "id" | "flag" | "status">
> = async (peer, data, esp32) => {
	const schema = InputSchema.pick({ id: true, flag: true, status: true })

	for (const i of data) {
		const res = schema.safeParse(i)
		if (!res.success) continue
		if (res.data.flag == res.data.status) continue

		for (const [id, a] of action.pool.actions) {
			if (a.inputId != i.id) continue
			action.pool.dequeue(id)
			action.event.invoke("Inactive", a)
		}
	}
}

//

const init = () => {
	const listeners: WebSocketEventListener[] = [
		{ event: "reading", query: "Create", handler: onCreateReading },
		{ event: "input", query: "Update", handler: onUpdateInput },
	]

	listeners.forEach((l) => event.listen(l))
	console.info(`Bridger event listeners initialized.`)
}

//

export default { init }
