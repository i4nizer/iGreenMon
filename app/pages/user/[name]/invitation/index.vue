<template>
    <v-container fluid class="bg-container pa-5 py-7">
        <v-row>
            <v-col>
                <h3>User Invitation</h3>
            </v-col>
        </v-row>
        <v-row>
            <!-- Own Invite ID -->
            <v-col cols="3">
                <span>My Invitee ID: <strong>{{ user?.id }}</strong></span>
            </v-col>
            <!-- For creating invitations -->
            <v-col cols="9" class="text-end py-0">
                <v-dialog class="w-100 w-md-50">
                    <template #activator="{ props: activatorProps }">
                        <v-btn class="bg-green" :="activatorProps">
                            <v-icon class="mr-1">mdi-plus</v-icon>
                            <span v-if="$vuetify.display.smAndUp">Invite</span>
                        </v-btn>
                    </template>
                    <template #default>
                        <invitation-form
                            class="bg-white rounded"
                            :greenhouses="ownGHs"
                            @error="onCreateInvError"
                            @success="onCreateInvSuccess"
                        />
                    </template>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row class="mt-5">
            <!-- Invitation Filters -->
            <v-col cols="12" class="py-0 d-flex flex-wrap align-center ga-5">
                <v-select
                    chips
                    multiple
                    hide-details
                    label="Status"
                    v-model="filter.status"
                    :items="['Emailed', 'Not Emailed']"
                ></v-select>
                <v-select
                    chips
                    multiple
                    hide-details
                    label="Response"
                    v-model="filter.response"
                    :items="['Unset', 'Accepted', 'Rejected', 'Cancelled']"
                ></v-select>
                <v-select
                    chips
                    multiple
                    hide-details
                    label="Direction"
                    v-model="filter.direction"
                    :items="['Incoming', 'Outgoing']"
                ></v-select>
            </v-col>
        </v-row>
        <v-row>
            <!-- Invitation Lists -->
            <v-col 
                v-for="inv in invs"
                cols="12"
                class="pb-0"
                :key="inv.id"
            >
                <invitation-card
                    :key="inv.id"
                    :incoming="user?.id == inv.inviteeId"
                    :invitation="inv"
                    @cancel="onCancelInv"
                    @accept="onAcceptInv"
                    @reject="onRejectInv"
                />
            </v-col>
            <!-- No Invitation -->
            <v-col v-if="invitations.length <= 0">
                <v-empty-state
                    icon="mdi-email-off"
                    text="There are no invitations."
                    title="No Invitations"
                ></v-empty-state>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

//

// --- Utils
const toast = useToast()

// --- User
const { user } = useUser()

// --- Greenhouses
const ghUtil = useGreenhouse()
const ghStore = useGreenhouseStore()
const { greenhouses } = ghStore
const ownGHs = computed(() => greenhouses.filter((g) => g.userId == user.value?.id))

const fetchGHs = async () => {
    if (greenhouses.length > 0) return
    const res = await ghUtil.retrieveAll()
    if (!res.success) return toast.error(res.error)
    res.data.forEach((g) => ghStore.append(g))
}

onBeforeMount(async () => await fetchGHs())
onServerPrefetch(async () => await fetchGHs())

// --- Invitations
const invUtil = useInvitation()
const invStore = useInvitationStore()
const { invitations } = invStore

const fetchInvs = async () => {
    if (invitations.length > 0) return
    const res = await invUtil.retrieveAll()
    if (!res.success) return toast.error(res.error)
    res.data.forEach((i) => invStore.append(i))
    invs.value = filterInvs(res.data, filter)
}

const onCancelInv = async (
    inv: InvitationGet,
    opts: { loading: Ref<boolean> }
) => {
    opts.loading.value = true
    const res = await invUtil.cancel(inv.id)
    opts.loading.value = false
    if (!res.success) return toast.error(res.error)
    invStore.change(res.data)
    toast.success(`Invitation cancelled successfully.`)
}

const onAcceptInv = async (
    inv: InvitationGet,
    opts: { loading: Ref<boolean> }
) => {
    opts.loading.value = true
    const res = await invUtil.accept(inv.id)
    opts.loading.value = false
    if (!res.success) return toast.error(res.error)
    invStore.change(res.data)
    toast.success(`Invitation accepted successfully.`)
}

const onRejectInv = async (
    inv: InvitationGet,
    opts: { loading: Ref<boolean> }
) => {
    opts.loading.value = true
    const res = await invUtil.reject(inv.id)
    opts.loading.value = false
    if (!res.success) return toast.error(res.error)
    invStore.change(res.data)
    toast.success(`Invitation declined successfully.`)
}

const onCreateInvError = (msg: string) => {
    toast.error(msg)
}

const onCreateInvSuccess = (inv: InvitationGet) => {
    invStore.append(inv)
    toast.success(`${inv.invitee.name} invited to ${inv.greenhouse.name}.`)
}

onBeforeMount(async () => await fetchInvs())
onServerPrefetch(async () => await fetchInvs())

// --- Filtering
const invs = useState<InvitationGet[]>("invs", () => [])
const filter = reactive({
    status: ["Emailed", "Not Emailed"],
    response: ["Unset", "Accepted", "Rejected", "Cancelled"],
    direction: ["Incoming", "Outgoing"],
})

const filterInvs = (
    invs: InvitationGet[],
    filter: {
        status: string[],
        response: string[],
        direction: string[]
    }
) => {
    const temp = []

    for (const inv of invs) {
        const status = inv.emailed ? "Emailed" : "Not Emailed"
        const incoming = user.value?.id == inv.inviteeId
        const direction = incoming ? "Incoming" : "Outgoing"

        let match = filter.status.includes(status)
        match = match && filter.response.includes(inv.response)
        match = match && filter.direction.includes(direction)

        if (match) temp.push(inv)
    }

    return temp
}

watch(
    filter,
    nv => invs.value = filterInvs(invitations, nv),
    { deep: true, immediate: true }
)

watch(
    invitations,
    nv => invs.value = filterInvs(nv, filter),
    { deep: true, immediate: true }
)

//

</script>

<style lang="scss" scoped></style>
