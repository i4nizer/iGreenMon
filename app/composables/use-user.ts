
//

export const useUser = (opts: { hydrate: boolean } = { hydrate: true }) => {
	// --- Data persists even server side
	const user = useState<UserSafe | undefined>("user", () => undefined)

	/** Asks the server for user details. */
	const whoami = async (): Promise<SafeResult<UserSafe>> => {
		try {
			if (user.value) return { success: true, data: user.value }
			const reqFetch = useRequestFetch()
			const res = await reqFetch<UserSafe>(`/api/user/whoami`)
			user.value = res
			return { success: true, data: res }
		} catch (error) {
			const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
		}
	}

	/** Updates the user details. */
	const update = async (data: UserUpdate): Promise<SafeResult<UserSafe>> => {
		try {
			const res = await $fetch<UserSafe>("/api/user", {
				method: "PATCH",
				body: data,
			})
			user.value = res
			return { success: true, data: res }
		} catch (error) {
			const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
		}
	}

	/** Hydrate */
	if (opts.hydrate) {
		onBeforeMount(async () => await whoami())
		onServerPrefetch(async () => await whoami())
	}

	// --- Expose
	return { user, whoami, update }
}
