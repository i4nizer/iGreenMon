export const TokenTypes = [
	"Access",
	"Refresh",
	"Reset",
	"Verify",
] as const

//

export type TokenType = (typeof TokenTypes)[number]
