import { TailScaledEventListener } from "./type";

//

const listeners: TailScaledEventListener[] = []

//

const listen = (listener: TailScaledEventListener) => {
    listeners.push(listener)
}

const unlisten = (listener: TailScaledEventListener) => {
    const idx = listeners.findIndex((l) => l === listener)
    if (idx != -1) listeners.splice(idx, 1)
}

const invoke = (ip: string, hostname: string) => {
    for (const l of listeners) {
        Promise.resolve()
            .then(() => l(ip, hostname))
            .catch(console.error)
    }
}

//

export default { listen, unlisten, invoke }
