
//

export const useAuthCheck = () => {
    /** Asks the server. */
    const isNameAvailable = async (name: string): Promise<boolean> => {
        let available = true
        const url = `/api/auth/check/name`
        await $fetch(url, { method: "POST", body: { name } })
            .catch(() => available = false)
        return available
    }
    
    /** Asks the server. */
    const isEmailAvailable = async (email: string): Promise<boolean> => {
        let available = true
        const url = `/api/auth/check/email`
        await $fetch(url, { method: "POST", body: { email } })
            .catch(() => available = false)
        return available
    }
    
    // --- Expose
    return { isNameAvailable, isEmailAvailable }
}