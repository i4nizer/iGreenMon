
//

type LogEventName = "Queue" | "Timeout" | "Dequeue"
type LogEventListener = (uid: number, lid: number) => any

//

export { LogEventName, LogEventListener }
