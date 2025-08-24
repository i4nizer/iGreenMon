const TokenType = [
	"Access",
	"Refresh",
	"Reset",
	"Verify",
	"Esp32",
	"Esp32Cam",
] as const
type TokenType = (typeof TokenType)[number]

//

export { TokenType }