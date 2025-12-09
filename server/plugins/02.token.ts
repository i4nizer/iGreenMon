import type { TokenType } from "../types/token"
import { tokenMetas } from "~~/server/services/token"
import { setTimeout } from "timers/promises"

//

export default defineNitroPlugin(async (nitro) => {
	// --- Wait for the database
	while (!nitro.sequelize) await setTimeout(5000)
	
	// --- Deconstruct and set configurations
	const config = useRuntimeConfig()
	const {
		jwtAccessLife,
		jwtRefreshLife,
		jwtVerifyLife,
		jwtResetLife,
		jwtEsp32Life,
		jwtEsp32CamLife,
		jwtSmsLife,
		jwtAccessSecret,
		jwtRefreshSecret,
		jwtVerifySecret,
		jwtResetSecret,
		jwtEsp32Secret,
		jwtEsp32CamSecret,
		jwtSmsSecret,
	} = config

	const jwtMetas: { type: TokenType; life: number; secret: string }[] = [
		{
			type: "Access",
			life: jwtAccessLife,
			secret: jwtAccessSecret,
		},
		{
			type: "Refresh",
			life: jwtRefreshLife,
			secret: jwtRefreshSecret,
		},
		{
			type: "Verify",
			life: jwtVerifyLife,
			secret: jwtVerifySecret,
		},
		{
			type: "Reset",
			life: jwtResetLife,
			secret: jwtResetSecret,
		},
		{
			type: "Esp32",
			life: jwtEsp32Life,
			secret: jwtEsp32Secret,
		},
		{
			type: "Esp32Cam",
			life: jwtEsp32CamLife,
			secret: jwtEsp32CamSecret,
		},
		{
			type: "Sms",
			life: jwtSmsLife,
			secret: jwtSmsSecret,
		},
	]

	tokenMetas.push(...jwtMetas)
	const isProd = config.nodeEnv == "production"
	if (!isProd) console.info("Token metas configured.")
})
