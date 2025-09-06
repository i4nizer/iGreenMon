import event from "./event"
import { ReadingCreate, ReadingCreateSchema } from "~~/shared/schema/reading"
import { Reading as ReadingModel } from "~~/server/models/reading"
import { WebSocketEventHandler, WebSocketEventListener } from "./schema"
import { Input, InputSchema } from "~~/shared/schema/input"
import { Input as InputModel} from "~~/server/models/input"

//

// --- Saves readings
const onCreateReading: WebSocketEventHandler<ReadingCreate> = async (
	peer,
	data,
	esp32
) => {
    const readings = []
	for (const r of data) {
		const res = ReadingCreateSchema.safeParse(r)
		if (!res.success) continue
		readings.push(res.data)
    }
    await ReadingModel.bulkCreate(readings)
}

// --- Updates inputs
const onUpdateInput: WebSocketEventHandler<
	Pick<Input, "id" | "flag" | "status">
> = async (peer, data, esp32) => {
	const schema = InputSchema.pick({ id: true, flag: true, status: true })
    const promises = []
	
    for (const i of data) {
		const res = schema.safeParse(i)
		if (!res.success) continue
        
        const promise = InputModel.update(
            { status: res.data.status },
            { where: { id: res.data.id } },
        )
        promises.push(promise)
    }
    
    await Promise.all(promises)
}

//

const init = () => {
    const listeners: WebSocketEventListener[] = [
        { event: "reading", query: "Create", handler: onCreateReading },
        { event: "input", query: "Update", handler: onUpdateInput },
    ]

    listeners.forEach((l) => event.listen(l))
    console.info(`Esp32::Syncer event listeners initialized.`)
}

//

export default { init }