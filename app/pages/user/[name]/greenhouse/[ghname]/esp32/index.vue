<template>
    <v-container fluid class="bg-container pa-5 py-7">
        <v-row>
            <v-col>
                <h3>Greenhouse Esp32</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-end py-0">
                <!-- For creating esp32 -->
                <v-dialog class="w-100 w-md-50">
                    <template #activator="{ props: activatorProps }">
                        <v-btn 
                            v-if="isOwnGH || canCreate(`Esp32`, permissions)" 
                            class="bg-green" 
                            :="activatorProps"
                        >
                            <v-icon class="mr-1">mdi-plus</v-icon>
                            <span v-if="$vuetify.display.smAndUp">
                                New Esp32
                            </span>
                        </v-btn>
                    </template>
                    <template #default>
                        <esp32-create-form
                            :greenhouse-id="gh?.id ?? -1"
                            class="bg-white rounded"
                            @error="e => toast.error(e)"
                            @success="onCreateEsp32Success"
                        />
                    </template>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row>
            <!-- Esp32 Update Form Dialog -->
            <v-dialog class="w-100 w-md-50" v-model="esp32UpdateDialog">
                <template #default>
                    <esp32-update-form
                        class="bg-white rounded"
                        :esp32="(esp32UpdateData as Esp32)"
                        @error="e => toast.error(e)"
                        @success="onUpdateEsp32Success"
                    />
                </template>
            </v-dialog>

            <!-- Esp32 Lists -->
            <v-col 
                v-for="esp32 in esp32s" 
                xs="12" 
                sm="6" 
                md="4" 
                lg="3" 
                xl="2"
                :key="esp32.id"
            >
                <esp32-card
                    :esp32
                    :hide-edit="!isOwnGH && !canModify(`Esp32`, permissions)"
                    :hide-delete="!isOwnGH && !canDelete(`Esp32`, permissions)"
                    @view="onViewEsp32"
                    @edit="onEditEsp32"
                    @delete="onDeleteEsp32"
                />
            </v-col>

            <!-- Fallback/emptystate when no esp32 -->
            <v-col v-if="esp32s.length <= 0">
                <v-empty-state
                    icon="mdi-sprout"
                    text="You haven't created any esp32 yet."
                    title="No esp32 yet"
                ></v-empty-state>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import type { Esp32 } from '~~/shared/schema/esp32'
import type { Greenhouse } from '~~/shared/schema/greenhouse'

//

// --- Utils
const route = useRoute()
const toast = useToast()
const ghUtil = useGreenhouse()
const userUtil = useUser({ hydrate: false })
const permUtil = usePermission()
const { canCreate, canModify, canDelete } = permUtil
const esp32Util = useEsp32()

// --- Store
const permStore = usePermissionStore()
const esp32Store = useEsp32Store()

// --- Params
const ghname = route.params.ghname as string

// --- Data
const gh = useState<Greenhouse | undefined>(`gh-${ghname}`, () => undefined)
const isOwnGH = computed(() => gh.value?.userId == user.value?.id)
const { user } = userUtil
const { esp32s } = esp32Store
const { permissions } = permStore

const fetchData = async () => {
    // --- Preserve nuxt context between awaits
    const nctx = useNuxtApp()
    const rwnctx = nctx.runWithContext

    if (!user.value) await userUtil.whoami()

    if (!gh.value) {
        const req = async () => await ghUtil.retrieve(ghname)
        const res = await rwnctx(req)
        if (res.success) gh.value = res.data
        else toast.error(res.error);
    }

    if (gh.value && esp32s.length <= 0) {
        const req = async () => esp32Util.retrieveAll(gh.value?.id as number)
        const res = await rwnctx(req)
        if (res.success) res.data.forEach((e) => esp32Store.append(e))
        else toast.error(res.error);
    }

    if (!isOwnGH.value && permissions.length <= 0) {
        const req = async () => await permUtil.retrieveAll(ghname)
        const res = await rwnctx(req)
        if (res.success) res.data.forEach((p) => permStore.append(p))
        else toast.error(res.error);
    }
}

onBeforeMount(fetchData)
onServerPrefetch(async () => {
    const nctx = useNuxtApp()
    await nctx.runWithContext(fetchData)
})

// --- For performance, single instance of update form dialog
const esp32UpdateData = ref<Esp32>()
const esp32UpdateDialog = ref(false)

// --- CRUD
const onCreateEsp32Success = (esp32: Esp32) => {
    esp32Store.append(esp32)
    toast.success("Esp32 created successfully.")
}

const onUpdateEsp32Success = (esp32: Esp32) => {
    esp32Store.change(esp32)
    toast.success("Esp32 updated successfully.")
    esp32UpdateDialog.value = false
}

const onDeleteEsp32Success = (esp32: Esp32) => {
    esp32Store.remove(esp32.id)
    toast.success("Esp32 deleted successfully.")
}

// --- Navigations from the card
const onViewEsp32 = async (esp32: Esp32, opts: { loading: Ref<boolean> }) => {
    const { name } = route.params
    opts.loading.value = true
    const url = `/user/${name}/greenhouse/${gh.value?.name}/esp32/${esp32.id}/${esp32.name}/dashboard`
    await navigateTo(url)
    opts.loading.value = false
}

const onEditEsp32 = async (esp32: Esp32, opts: { loading: Ref<boolean> }) => {
    esp32UpdateData.value = esp32
    esp32UpdateDialog.value = true
}

const onDeleteEsp32 = async (esp32: Esp32, opts: { loading: Ref<boolean> }) => {
    opts.loading.value = true
    const res = await esp32Util.destroy(esp32.id)
    opts.loading.value = false

    if (!res.success) toast.error(res.error)
    else onDeleteEsp32Success(esp32)
}

//

</script>

<style lang="scss" scoped></style>
