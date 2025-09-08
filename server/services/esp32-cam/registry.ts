import { Peer } from "crossws"
import { Esp32Cam } from "~~/shared/schema/esp32-cam"
import { Esp32Cam as Esp32CamModel } from "~~/server/models/esp32-cam"

//

const peers = new Map<string, Peer>() // Peer.id => Peer
const esp32Cams = new Map<string, Esp32Cam>() // Peer.id => Esp32Cam

//

const register = async (peer: Peer, esp32Cam: Esp32Cam) => {
    peers.set(peer.id, peer)
    esp32Cams.set(peer.id, esp32Cam)
    
    console.info(`Esp32Cam ${esp32Cam.name} registered.`)
    await Esp32CamModel.update(
        { connected: true },
        { where: { id: esp32Cam.id } }
    )
}

const unregister = async (pid: string) => {
    peers.delete(pid)
    const esp32Cam = esp32Cams.get(pid)
    if (!esp32Cam) return
    
    esp32Cams.delete(pid)
    console.info(`Esp32Cam ${esp32Cam.name} unregistered.`)
    await Esp32CamModel.update(
		{ connected: false },
		{ where: { id: esp32Cam.id } }
	)
}

//

export default { peers, esp32Cams, register, unregister }
