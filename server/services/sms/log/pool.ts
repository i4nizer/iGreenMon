
//

import event from "./event"

// --- List of sent log for sms
const logs = new Map<number, number>() // User.id => Log.id
const timer = new Map<number, number>() // User.id => timequeued

//

const queue = (uid: number, lid: number) => {
    logs.set(uid, lid)
    timer.set(uid, Date.now())
    event.invoke("Queue", uid, lid)
    console.info(`Sms log queued user ${uid} log ${lid}.`)
}

const dequeue = (uid: number) => {
    const lid = logs.get(uid)
    if (lid) event.invoke("Dequeue", uid, lid)
    logs.delete(uid)
    timer.delete(uid)
    console.info(`Sms log dequeued user ${uid}.`)
}

//

export default { logs, timer, queue, dequeue }
