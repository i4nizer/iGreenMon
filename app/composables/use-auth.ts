
//

export const useAuth = () => {
	/** Sends the user credential to server for sign-up. */
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
	
	/** Sends the user credential to server for sign-in. */
	const signIn = async (
		user: UserSignIn
	): Promise<SafeResult<{ redirectUrl: string }>> => {
		try {
			const res = await $fetch(`/api/auth/sign-in`, {
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
	return { signUp, signIn }
}
