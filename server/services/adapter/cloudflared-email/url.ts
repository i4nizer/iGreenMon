import cloudflared from "../../cloudflared"
import { User } from "~~/server/models/user"
import { queueEmail } from "../../email"

//

const onCloudflaredUrl = async (url: string) => {
	console.info(`Cloudflared tunnel active on ${url}.`)

	const ssres = await useTemplate({
		type: "Cloudflared-Tunnel",
		safe: true,
		data: { url },
	})
	if (!ssres.success) return console.error("Cloudflared tunnel email failed.")

	// --- Email to owner
	const config = useRuntimeConfig()
	const callback = (e: any, i: any) => {
		if (!!e) return console.error("Cloudflared tunnel email failed.")
		console.info("Cloudflared tunnel url emailed.")
	}

    const gmail = config.gmailAddress
	queueEmail(gmail, "Cloudflared Tunnel", undefined, ssres.data, callback)

	// --- Email to users
	const users = await User.findAll({ attributes: ["email"] })
	for (const user of users) {
		const email = user.email

		const callback = (e: any, i: any) => {
			if (!!e) return console.error("Cloudflared tunnel email failed.")
			console.info(`Cloudflared tunnel url emailed to ${email}.`)
		}

		queueEmail(email, "Cloudflared Tunnel", undefined, ssres.data, callback)
	}
}

//

const init = () => {
	cloudflared.hook.listen(onCloudflaredUrl)
}

//

export default { init }
