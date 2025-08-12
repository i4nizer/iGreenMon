
//

export const useInvitationStore = defineStore("invitation", () => {
    // --- Data
    const invitations = reactive<InvitationGet[]>([])

    // --- These applies dedups
    const append = (invitation: InvitationGet) => {
        const idx = invitations.findIndex((g) => g.id == invitation.id)
        if (idx != -1) invitations.splice(idx, 1, invitation)
        else invitations.push(invitation)
    }

    const change = (invitation: InvitationGet) => {
        const idx = invitations.findIndex((g) => g.id == invitation.id)
		if (idx != -1) invitations.splice(idx, 1, invitation)
    }

    const remove = (id: number) => {
        const filtered = invitations.filter((g) => g.id != id)
        invitations.splice(0, invitations.length)
        invitations.push(...filtered)
    }

    // --- Expose
    return { invitations, append, change, remove }
})