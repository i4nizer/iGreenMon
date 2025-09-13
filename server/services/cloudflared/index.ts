import hook from "./hook"
import { Tunnel } from "cloudflared"

//

const init = async (src: string = "http://127.0.0.1:3000") => {
	const tunnel = Tunnel.quick(src)

	const url = new Promise<string>((res) => tunnel.once("url", res))
	url.then((u) => hook.invoke(u)).catch(console.error)

	return await new Promise((res) => tunnel.once("connected", res))
}

//

export default { init, hook }
