const TokenType = [
	"Access",
	"Refresh",
	"Reset",
	"Verify",
	"Esp32",
	"Esp32Cam",
	"Sms",
] as const
type TokenType = (typeof TokenType)[number]

//

export { TokenType }