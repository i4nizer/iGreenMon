type SafeResult<T = any, E = string> =
	| { success: true; data: T }
	| { success: false; error: E }

//

export type { SafeResult }