
//

export const useAuthVerification = () => {
	/** Provides the time when will the resend be available. */
	const getNextResendTime = async (
		email: string
	): Promise<SafeResult<{ nextResendTime: number }>> => {
		try {
			const url = `/api/auth/verification/time`
			const res = await $fetch(url, { method: "POST", body: { email } })
			return { success: true, data: res }
		} catch (error) {
			const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
		}
	}

	/** Will fail if resend is on cooldown. */
	const resendVerificationEmail = async (
		email: string
	): Promise<SafeResult<{ nextResendTime: number }>> => {
		try {
			const url = `/api/auth/verification/resend`
			const res = await $fetch(url, { method: "POST", body: { email } })
			return { success: true, data: res }
		} catch (error) {
			const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
		}
	}

	const verifyUser = async (
		email: string,
		token: string
	): Promise<SafeResult<{ redirectUrl: string }>> => {
		try {
			const url = `/api/auth/verification/verify`
			const res = await $fetch(url, {
				method: "POST",
				body: { email, token },
            })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
        }
	}

	// --- Expose
	return { getNextResendTime, resendVerificationEmail, verifyUser }
}
