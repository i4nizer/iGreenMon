import hook from "./hook"
import { exec } from "child_process"
import { promisify } from "util"

//

const init = async (key: string = "tskey-12345678") => {
	const execAsync = promisify(exec)
	
	let result = await execAsync("tailscale status --json")
	let status = JSON.parse(result.stdout)
	const online = !!status.Self?.Online
	if (online) return hook.invoke(status.Self.TailscaleIPs?.[0], status.Self.DNSName)
	
	await execAsync(`tailscale up --authkey=${key} --ssh --accept-dns=true`)		
	result = await execAsync("tailscale status --json")
	status = JSON.parse(result.stdout)
	hook.invoke(status.Self.TailscaleIPs?.[0], status.Self.DNSName)
}

//

export default { init, hook }
