const TokenType = [
	"Access",
	"Refresh",
	"Reset",
	"Verify",
	"Esp32",
] as const
type TokenType = (typeof TokenType)[number]

//

export { TokenType }