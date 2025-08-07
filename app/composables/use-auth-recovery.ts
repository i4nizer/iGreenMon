
//

export const useAuthRecovery = () => {
	/** Returns an error if still on cooldown. */
	const forgotPassword = async (
		email: string
	): Promise<SafeResult<{ redirectUrl: string }>> => {
		try {
			const url = `/api/auth/recovery/forgot`
            const res = await $fetch(url, { method: "POST", body: { email } })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
        }
    }

    /** Asks the server for the cooldown, errors if haven't forgot. */
    const getNextResetResendTime = async (
        email: string
    ): Promise<SafeResult<{ nextResendTime: number }>> => {
        try {
			const url = `/api/auth/recovery/time`
			const res = await $fetch(url, { method: "POST", body: { email } })
			return { success: true, data: res }
		} catch (error) {
			const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
		}
    }

    /** Requests the server to resend the email. */
    const resendResetPasswordEmail = async (
        email: string
    ): Promise<SafeResult<{ nextResendTime: number }>> => {
        try {
			const url = `/api/auth/recovery/resend`
			const res = await $fetch(url, { method: "POST", body: { email } })
			return { success: true, data: res }
		} catch (error) {
			const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
		}
    }
    
    // --- Expose
    return { forgotPassword, getNextResetResendTime, resendResetPasswordEmail }
}
