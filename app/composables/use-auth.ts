
//

export const useAuth = () => {
	// --- Signing Functions
	const signUp = async (
		user: UserSignUp
	): Promise<SafeResult<{ redirectUrl: string }>> => {
		try {
			const res = await $fetch(`/api/auth/sign-up`, {
				method: "POST",
				body: user,
			})
			return { data: res, error: undefined, success: true }
		} catch (error) {
			const msg = (error as any)?.message ?? "Something went wrong."
			return { data: undefined, error: msg, success: false }
		}
	}

	// --- Expose
	return { signUp }
}
