import type { TokenType } from "~~/server/types/token-type"
import type { SafeResult } from "~~/shared/types/safe-result"
import jwt from "jsonwebtoken"
import { tokenMetas } from "./config"

//

/** Calls jwt.sign(), and signs payload based on token meta. */
const createToken = (payload: string | Buffer | object, type: TokenType) => {
	const tokenMeta = tokenMetas.find((t) => t.type == type)
	if (!tokenMeta) throw Error("Token service has missing token type meta.")
	return jwt.sign(payload, tokenMeta.secret, { expiresIn: tokenMeta.life })
}

/** Uses token meta to identify token secret. */
const verifyToken = <T = any>(token: string, type: TokenType) => {
	const tokenMeta = tokenMetas.find((t) => t.type == type)
	if (!tokenMeta) throw Error("Token service has missing token type meta.")
	return jwt.verify(token, tokenMeta.secret) as T
}

//

/** Calls jwt.sign(), and signs payload based on token meta. */
const safeCreateToken = (
	payload: string | Buffer | object,
	type: TokenType
): SafeResult<string> => {
	try {
		const token = createToken(payload, type)
		return { data: token, error: undefined, success: true }
	} catch (error) {
		const err = error as Error
		return { data: undefined, error: err.message, success: false }
	}
}

/** Uses token meta to identify token secret. */
const safeVerifyToken = <T = any>(
	token: string,
	type: TokenType
): SafeResult<T, jwt.VerifyErrors | Error> => {
	try {
		const payload = verifyToken<T>(token, type)
		return { data: payload, error: undefined, success: true }
	} catch (error) {
		const err = error as jwt.VerifyErrors | Error
		return { data: undefined, error: err, success: false }
	}
}

//

export {
    tokenMetas,
	createToken,
	verifyToken,
	safeCreateToken,
	safeVerifyToken,
}
