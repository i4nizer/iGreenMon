
//

/**
 * Redirects user to user page when there is access token. 
 * Redirects user to sign-in page when there is no access token. 
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
    // --- Client-side only
    if (!import.meta.client) return;

    // --- Get paths and tokens
    const isAuthPage = to.path.startsWith("/auth")
    const isUserPage = /^\/user\/[^\/]+$/.test(to.path)
    const accessToken = useCookie("access-token")

    // --- Trying to access user page without access token
    if (isUserPage && !accessToken.value) return await navigateTo("/auth/sign-in")
    
    // --- Trying to access auth page with access token
    if (isAuthPage && accessToken.value) {
        const { whoami } = useUser({ hydrate: false })
        const userResult = await whoami()
        if (!userResult.success) return;
        
        const user = userResult.data
        return await navigateTo(`/user/${user.name}/greenhouse`)
    }
})