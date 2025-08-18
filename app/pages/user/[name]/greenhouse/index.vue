<template>
    <v-container fluid class="bg-container pa-5 py-7">
        <v-row>
            <v-col>
                <h3>User Greenhouse</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-end py-0">
                <!-- For creating greenhouse -->
                <v-dialog class="w-100 w-md-50">
                    <template #activator="{ props: activatorProps }">
                        <v-btn class="bg-green" :="activatorProps">
                            <v-icon class="mr-1">mdi-plus</v-icon>
                            <span v-if="$vuetify.display.smAndUp">New Greenhouse</span>
                        </v-btn>
                    </template>
                    <template #default>
                        <greenhouse-create-form
                            class="bg-white rounded"
                            @error="e => toast.error(e)"
                            @success="onCreateGHSuccess"
                        />
                    </template>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row>
            <!-- Greenhouse Update Form Dialog -->
            <v-dialog class="w-100 w-md-50" v-model="ghUpdateDialog">
                <template #default>
                    <greenhouse-update-form
                        class="bg-white rounded"
                        :greenhouse="(ghUpdateData as Greenhouse)"
                        @error="e => toast.error(e)"
                        @success="onUpdateGHSuccess"
                    />
                </template>
            </v-dialog>

            <!-- Greenhouse Lists -->
            <v-col 
                v-for="greenhouse in greenhouses" 
                xs="12" 
                sm="6" 
                md="4" 
                lg="3" 
                xl="2"
                :key="greenhouse.id"
            >
                <greenhouse-card
                    :greenhouse
                    :hide-edit="user?.id != greenhouse.userId"
                    :hide-delete="user?.id != greenhouse.userId"
                    @view="onViewGH"
                    @edit="onEditGH"
                    @delete="onDeleteGH"
                />
            </v-col>

            <!-- Fallback/emptystate when no greenhouse -->
            <v-col v-if="greenhouses.length <= 0">
                <v-empty-state
                    icon="mdi-sprout"
                    text="You haven't created any greenhouse yet."
                    title="No greenhouse yet"
                ></v-empty-state>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

//

// --- Utils
const route = useRoute()
const toast = useToast()

// --- User
const { user } = useUser()
onMounted(() => console.log(JSON.stringify(user.value)))
// --- Utilities
const { retrieve, retrieveAll, destroy } = useGreenhouse()
const { greenhouses, append, change, remove } = useGreenhouseStore()

// --- Initialization
const fetchGreenhouses = async () => {
    if (greenhouses.length > 0) return;
    const getResult = await retrieveAll()
    if (!getResult.success) return toast.error(getResult.error)
    getResult.data.forEach(g => append(g))
}

onBeforeMount(async () => await fetchGreenhouses())
onServerPrefetch(async () => await fetchGreenhouses())

// --- For performance, single instance of update form dialog
const ghUpdateData = ref<Greenhouse>()
const ghUpdateDialog = ref(false)

// --- CRUD
const onCreateGHSuccess = (greenhouse: Greenhouse) => {
    append(greenhouse)
    toast.success("Greenhouse created successfully.")
}

const onUpdateGHSuccess = (greenhouse: Greenhouse) => {
    change(greenhouse)
    toast.success("Greenhouse updated successfully.")
    ghUpdateDialog.value = false
}

const onDeleteGHSuccess = (greenhouse: Greenhouse) => {
    remove(greenhouse.id)
    toast.success("Greenhouse deleted successfully.")
}

// --- Navigations from the card
const onViewGH = async (gh: Greenhouse, opts: { loading: Ref<boolean> }) => {
    const { name } = route.params
    opts.loading.value = true
    await navigateTo(`/user/${name}/greenhouse/${gh.name}/dashboard`)
    opts.loading.value = false
}

const onEditGH = async (gh: Greenhouse, opts: { loading: Ref<boolean> }) => {
    ghUpdateData.value = gh
    ghUpdateDialog.value = true
}

const onDeleteGH = async (gh: Greenhouse, opts: { loading: Ref<boolean> }) => {
    opts.loading.value = true
    const delResult = await destroy(gh.name)
    opts.loading.value = false
    if (!delResult.success) toast.error(delResult.error)
    else onDeleteGHSuccess(gh)
}

//

</script>

<style lang="scss" scoped></style>
