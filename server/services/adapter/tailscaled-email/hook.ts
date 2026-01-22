import tailscaled from "../../tailscaled"
import { queueEmail } from "../../email"

//

const onTailscaledInit = async (ip: string, hostname: string) => {
	console.info(`Tailscaled ssh active on ssh://${ip} or ssh://${hostname}.`)

	// --- Render template
	const ssres = await useTemplate({
		type: "Tailscaled-SSH",
		safe: true,
		data: { ip, hostname },
	})
	if (!ssres.success) return console.error("Tailscaled ssh email failed.")

	// --- Error helper
	const callback = (e: any, i: any) => {
		if (!!e) return console.error("Tailscaled ssh email failed.")
		console.info("Tailscaled ssh ip/hostname emailed.")
	}

	// --- Email to developer
	const config = useRuntimeConfig()
    const gmail = config.devGmailAddress
	queueEmail(gmail, "Tailscaled SSH", undefined, ssres.data, callback)
}

//

const init = () => {
	tailscaled.hook.listen(onTailscaledInit)
}

//

export default { init }
