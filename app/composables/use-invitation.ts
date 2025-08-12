
//

export const useInvitation = () => {
	// --- CRUD utilities
	const createInvitation = async (
		data: InvitationCreate
	): Promise<SafeResult<InvitationGet>> => {
		try {
			const url = `/api/user/invitation`
			const res = await $fetch<InvitationGet>(url, {
				method: "POST",
				body: data,
			})
			return { success: true, data: res }
		} catch (error) {
			const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
		}
    }
    
    const retrieveInvitation = async (
        invitationId: number
    ): Promise<SafeResult<InvitationGet>> => {
        try {
            const url = `/api/user/invitation/${invitationId}`
            const reqFetch = useRequestFetch()
			const res = await reqFetch<InvitationGet>(url)
			return { success: true, data: res }
		} catch (error) {
			const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
		}
    }

    const retrieveAllInvitation = async (
    ): Promise<SafeResult<InvitationGet[]>> => {
        try {
            const url = `/api/user/invitation`
            const reqFetch = useRequestFetch()
			const res = await reqFetch<InvitationGet[]>(url)
			return { success: true, data: res }
		} catch (error) {
			const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
		}
    }

    // --- Response utilities
	const cancelInvitation = async (
		invid: number
	): Promise<SafeResult<InvitationGet>> => {
		try {
            const url = `/api/user/invitation/${invid}/cancel`
            const reqFetch = useRequestFetch()
			const res = await reqFetch<InvitationGet>(url)
			return { success: true, data: res }
		} catch (error) {
			const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
		}
	}

	const acceptInvitation = async (
		invid: number
	): Promise<SafeResult<InvitationGet>> => {
		try {
            const url = `/api/user/invitation/${invid}/accept`
            const reqFetch = useRequestFetch()
			const res = await reqFetch<InvitationGet>(url)
			return { success: true, data: res }
		} catch (error) {
			const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
		}
	}

	const rejectInvitation = async (
		invid: number
	): Promise<SafeResult<InvitationGet>> => {
		try {
            const url = `/api/user/invitation/${invid}/reject`
            const reqFetch = useRequestFetch()
			const res = await reqFetch<InvitationGet>(url)
			return { success: true, data: res }
		} catch (error) {
			const msg = (error as any)?.statusMessage ?? "Something went wrong."
			return { success: false, error: msg }
		}
	}

	// --- Expose
    return {
        retrieveInvitation,
        retrieveAllInvitation,
		createInvitation,
		cancelInvitation,
		acceptInvitation,
		rejectInvitation,
	}
}
