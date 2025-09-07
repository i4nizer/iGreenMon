import { Peer } from "crossws"
import { UserSafe } from "~~/shared/schema/user"

//

// --- Registry
const peers = new Map<string, Peer>() // Peer.id => Peer
const users = new Map<string, UserSafe>() // Peer.id => User

//

const register = (peer: Peer, user: UserSafe) => {
    peers.set(peer.id, peer)
    users.set(peer.id, user)
    console.info(`Data user ${user.name} registered.`)
}

const unregister = (pid: string) => {
    peers.delete(pid)
    const user = users.get(pid)
    if (user) console.info(`Data user ${user.name} unregistered.`)
}

//

export default { peers, users, register, unregister }
