
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
			return { success: true, data: res }
		} catch (error) {
			const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
		}
	}

	// --- Expose
	return { signUp }
}
