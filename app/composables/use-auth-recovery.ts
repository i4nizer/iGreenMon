
//

export const useAuthRecovery = () => {
	/**  */
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
    
    // --- Expose
    return { forgotPassword }
}
