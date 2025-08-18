const TokenType = [
	"Access",
	"Refresh",
	"Reset",
	"Verify",
] as const
type TokenType = (typeof TokenType)[number]

//

export { TokenType }