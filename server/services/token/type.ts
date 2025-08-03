import type { TokenType } from "~~/server/types/token-type"

//

type TokenMeta = {
	life: number
	type: TokenType
	secret: string
}

//

export { TokenMeta }
