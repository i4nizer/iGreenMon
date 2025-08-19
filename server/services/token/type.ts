import type { TokenType } from "~~/server/types/token"

//

type TokenMeta = {
	life: number
	type: TokenType
	secret: string
}

//

export { TokenMeta }
