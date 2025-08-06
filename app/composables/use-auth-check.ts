
//

export const useAuthCheck = () => {
    /** Asks the server. */
    const isNameAvailable = async (name: string): Promise<SafeResult<boolean>> => {
        try {
            const url = `/api/auth/check/name`
            const res = await $fetch(url, { method: "POST", body: { name } })
            return { success: true, data: res }
        } catch (error) {
            const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
        }
    }
    
    /** Asks the server. */
    const isEmailAvailable = async (email: string): Promise<SafeResult<boolean>> => {
        try {
			const url = `/api/auth/check/email`
			const res = await $fetch(url, { method: "POST", body: { email } })
			return { success: true, data: res }
		} catch (error) {
			const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
		}
    }
    
    // --- Expose
    return { isNameAvailable, isEmailAvailable }
}