import type { TokenType } from "../types/token-type"
import { tokenMetas } from "~~/server/services/token"

//

export default defineNitroPlugin(() => {
	// --- Deconstruct and set configurations
	const config = useRuntimeConfig()
	const {
		jwtAccessLife,
		jwtRefreshLife,
		jwtVerifyLife,
		jwtResetLife,
		jwtAccessSecret,
		jwtRefreshSecret,
		jwtVerifySecret,
		jwtResetSecret,
    } = config
    
    const jwtMetas: { type: TokenType, life: number, secret: string }[] = [
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
    ]
    
	tokenMetas.push(...jwtMetas)
	const isProd = config.nodeEnv == "production"
	if (!isProd) console.info("Token metas configured.")
})
