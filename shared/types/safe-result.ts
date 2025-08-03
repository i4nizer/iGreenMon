type SafeResult<T = any, E = string> =
	| { success: true; data: T; error: undefined }
	| { success: false; data: undefined; error: E }

//

export type { SafeResult }