import { CloudflaredEventListener } from "./type";

//

const listeners: CloudflaredEventListener[] = []

//

const listen = (listener: CloudflaredEventListener) => {
    listeners.push(listener)
}

const unlisten = (listener: CloudflaredEventListener) => {
    const idx = listeners.findIndex((l) => l === listener)
    if (idx != -1) listeners.splice(idx, 1)
}

const invoke = (url: string) => {
    for (const l of listeners) {
        Promise.resolve()
            .then(() => l(url))
            .catch(console.error)
    }
}

//

export default { listen, unlisten, invoke }
