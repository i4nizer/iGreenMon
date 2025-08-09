
//

/**
 * Redirects user to user page when there is access token. 
 * Redirects user to sign-in page when there is no access token. 
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
    // --- Route notifs
    const toast = useToast()

    // --- Get paths and tokens
    const isAuthPage = to.path.startsWith("/auth")
    const isUserPage = to.path.startsWith("/user")
    const accessToken = useCookie("access-token")

    // --- User page constraints that needs redirects
    if (isUserPage) {
        // --- Trying to access user page without access token
        if (!accessToken.value && to.path != "/auth/sign-in") {
            toast.info("Kindly sign-in first to access user pages.")
            return await navigateTo("/auth/sign-in")
        }

        // --- Check who really is signed-in
        const { whoami } = useUser({ hydrate: false })
        const userResult = await whoami()
        if (!userResult.success) {
            return toast.error("Something went wrong, kindly refresh the page.")
        }
        
        // --- Trying to access user page with different name
        const user = userResult.data
        const isNameMatch = user.name == to.params.name
        if (!isNameMatch) {
            // --- Replace the name segment
            const segments = to.path.split("/")
            segments[2] = user.name
            return await navigateTo(segments.join("/"), { replace: true })
        }
    }
    
    // --- Trying to access auth page with access token
    if (isAuthPage && accessToken.value && !to.path.startsWith("/user")) {
        const { whoami } = useUser({ hydrate: false })
        const userResult = await whoami()
        if (!userResult.success) {
            return toast.error("Something went wrong, kindly refresh the page.")
        }
        
        const user = userResult.data
        return await navigateTo(`/user/${user.name}/greenhouse`)
    }
})