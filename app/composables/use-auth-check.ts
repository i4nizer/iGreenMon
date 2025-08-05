
//

export const useAuthCheck = () => {
    /** Asks the server. */
    const isNameAvailable = async (name: string): Promise<boolean> => {
        let available = true
        await $fetch(`/api/auth/check/name/${name}`).catch(() => available = false)
        return available
    }
    
    /** Asks the server. */
    const isEmailAvailable = async (email: string): Promise<boolean> => {
        let available = true
        await $fetch(`/api/auth/check/email/${email}`).catch(() => available = false)
        return available
    }
    
    // --- Expose
    return { isNameAvailable, isEmailAvailable }
}