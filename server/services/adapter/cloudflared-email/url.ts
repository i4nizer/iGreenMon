import cloudflared from "../../cloudflared"
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
    const config = useRuntimeConfig()
    
    const callback = (e: any, i: any) => {
        if (!!e) return console.error("Cloudflared tunnel email failed.")
        console.info("Cloudflared tunnel url emailed.")
    }

    queueEmail(
        config.gmailAddress,
        "Cloudflared Tunnel",
        undefined,
        ssres.data,
        callback
    )
}

//

const init = () => {
	cloudflared.hook.listen(onCloudflaredUrl)
}

//

export default { init }
