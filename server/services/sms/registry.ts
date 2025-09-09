import log from "./log/pool"
import { Peer } from "crossws"
import { UserItem } from "./schema"
import { Log as LogModel } from "~~/server/models/log"
import { Op } from "sequelize"

//

const peers = new Map<string, Peer>() // Peer.id => Peer
const users = new Map<string, UserItem>() // Peer.id => User.id
const logs = new Map<number, Set<number>>() // User.id => (Log.id)[]

//

const register = async (peer: Peer, user: UserItem) => {
	peers.set(peer.id, peer)
	users.set(peer.id, user)

	const lres = await LogModel.findAll({
        where: {
            level: { [Op.or]: ["Warning", "Error"] },
            messaged: false,
            userId: user.id,
        },
		attributes: ["id"],
	})
	const lids = lres.map((l) => l.id)
	logs.set(user.id, new Set(lids))

	console.info(`Sms registered for ${user.name}.`)
}

const unregister = (pid: string) => {
	peers.delete(pid)
	const user = users.get(pid)
	users.delete(pid)

	if (!user) return
	logs.delete(user.id)
	log.dequeue(user.id)
	console.info(`Sms unregistered for ${user.name}.`)
}

//

export default { peers, users, logs, register, unregister }
