
//

export const useAuthVerification = () => {

    const getNextResendTime = async (
        email: string
    ): Promise<SafeResult<{ nextResendTime: number }>> => { 
        try {
			const url = `/api/auth/verification/time`
			const res = await $fetch(url, { method: "POST", body: { email } })
			return { success: true, data: res }
		} catch (error) {
			const msg = (error as any)?.message ?? "Something went wrong."
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
            const msg = (error as any)?.message ?? "Something went wrong."
			return { success: false, error: msg }
        }
    }
    
    // --- Expose
    return { getNextResendTime, resendVerificationEmail }
}
