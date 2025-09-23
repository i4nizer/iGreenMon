<template>
    <v-container fluid class="bg-container pa-5 py-7">
        <v-row>
            <v-col>
                <h3>Greenhouse Esp32Cam</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-end py-0">
                <!-- For creating esp32Cam -->
                <v-dialog class="w-100 w-md-50">
                    <template #activator="{ props: activatorProps }">
                        <v-btn 
                            v-if="isOwnGH || canCreate(`Esp32Cam`, permissions)" 
                            class="bg-green" 
                            :="activatorProps"
                        >
                            <v-icon class="mr-1">mdi-plus</v-icon>
                            <span v-if="$vuetify.display.smAndUp">
                                New Esp32Cam
                            </span>
                        </v-btn>
                    </template>
                    <template #default>
                        <esp32-cam-create-form
                            v-if="gh"
                            :greenhouse-id="gh.id"
                            class="bg-white rounded overflow-auto"
                            @error="e => toastUtil.error(e)"
                            @success="onCreateEsp32CamSuccess"
                        />
                    </template>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row>
            <!-- Esp32Cam Update Form Dialog -->
            <v-dialog class="w-100 w-md-50" v-model="esp32CamUpdateDialog">
                <template #default>
                    <esp32-cam-update-form
                        class="bg-white rounded overflow-auto"
                        :esp32Cam="(esp32CamUpdateData as Esp32Cam)"
                        @error="e => toastUtil.error(e)"
                        @success="onUpdateEsp32CamSuccess"
                    />
                </template>
            </v-dialog>
            <!-- Esp32Cam Lists -->
            <v-col 
                v-for="esp32Cam in esp32Cams" 
                xs="12" 
                sm="6" 
                md="4" 
                lg="3" 
                xl="2"
                :key="esp32Cam.id"
            >
                <esp32-cam-card
                    :esp32Cam
                    :hide-edit="!isOwnGH && !canModify(`Esp32Cam`, permissions)"
                    :hide-delete="!isOwnGH && !canDelete(`Esp32Cam`, permissions)"
                    @view="onViewEsp32Cam"
                    @edit="onEditEsp32Cam"
                    @delete="onDeleteEsp32Cam"
                />
            </v-col>
            <!-- Fallback/emptystate when no esp32Cam -->
            <v-col v-if="esp32Cams.length <= 0">
                <v-empty-state
                    icon="mdi-camera"
                    text="You haven't created any esp32-cam yet."
                    title="No esp32-cam yet"
                ></v-empty-state>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import type { Esp32Cam } from '~~/shared/schema/esp32-cam'
import type { Greenhouse } from '~~/shared/schema/greenhouse'

//

// --- Nuxt CTX
const nctx = useNuxtApp()
const rwnctx = nctx.runWithContext

// --- User
const userUtil = useUser()
const { user } = userUtil

// --- Notif
const toastUtil = useToast()

// --- Route Data
const routeUtil = useRoute()
const ghname = routeUtil.params.ghname as string

// --- SSR'ed state
const ssred = useState<boolean>(`${ghname}-esp32-cam`, () => false)
onBeforeUnmount(() => ssred.value = false)

// --- Greenhouse
const ghUtil = useGreenhouse()
const gh = useState<Greenhouse | undefined>(`gh-${ghname}`)
const isOwnGH = computed(() => gh.value?.userId == user.value?.id)

const fetchGH = async () => {
    if (gh.value) return;
    const res = await ghUtil.retrieve(ghname)
    if (!res.success) return toastUtil.error(res.error)
    gh.value = res.data
}

// --- Permissions
const permUtil = usePermission()
const permStore = usePermissionStore()
const { permissions } = permStore
const { canCreate, canAccess, canModify, canDelete } = permUtil

const fetchPerms = async () => {
    if (isOwnGH.value || permissions.length > 0) return;
    const res = await permUtil.retrieveAll(ghname)
    if (!res.success) return toastUtil.error(res.error)
    res.data.forEach((p) => permStore.append(p))
}

// --- Esp32Cams
const esp32CamUtil = useEsp32Cam()
const esp32CamStore = useEsp32CamStore()
const { esp32Cams } = esp32CamStore

const canAccessEsp32Cam = computed(() => canAccess("Esp32Cam", permissions))

const fetchEsp32Cams = async () => {
    if (!isOwnGH.value && !canAccessEsp32Cam.value) return;
    if (!gh.value || ssred.value) return;
    const res = await esp32CamUtil.retrieveAll(gh.value.id)
    if (!res.success) return toastUtil.error(res.error)
    esp32Cams.splice(0, esp32Cams.length)
    esp32Cams.push(...res.data)
}

// --- Esp32Cam CRUD
const esp32CamUpdateData = ref<Esp32Cam>()
const esp32CamUpdateDialog = ref(false)

const onViewEsp32Cam = async (
    esp32Cam: Esp32Cam,
    opts: { loading: Ref<boolean> }
) => {
    const { name } = routeUtil.params
    opts.loading.value = true
    const ghUrl = `/user/${name}/greenhouse/${gh.value?.name}`
    const esp32CamUrl = `/esp32-cam/${esp32Cam.id}/${esp32Cam.name}/dashboard`
    await navigateTo(ghUrl + esp32CamUrl)
    opts.loading.value = false
}

const onEditEsp32Cam = async (
    esp32Cam: Esp32Cam,
    opts: { loading: Ref<boolean> }
) => {
    esp32CamUpdateData.value = esp32Cam
    esp32CamUpdateDialog.value = true
}

const onDeleteEsp32Cam = async (
    esp32Cam: Esp32Cam,
    opts: { loading: Ref<boolean> }
) => {
    opts.loading.value = true
    const res = await esp32CamUtil.destroy(esp32Cam.id)
    opts.loading.value = false

    if (!res.success) toastUtil.error(res.error)
    else onDeleteEsp32CamSuccess(esp32Cam)
}

const onCreateEsp32CamSuccess = (esp32Cam: Esp32Cam) => {
    esp32CamStore.append(esp32Cam)
    toastUtil.success("Esp32Cam created successfully.")
}

const onUpdateEsp32CamSuccess = (esp32Cam: Esp32Cam) => {
    esp32CamStore.change(esp32Cam)
    toastUtil.success("Esp32Cam updated successfully.")
    esp32CamUpdateDialog.value = false
}

const onDeleteEsp32CamSuccess = (esp32Cam: Esp32Cam) => {
    esp32CamStore.remove(esp32Cam.id)
    toastUtil.success("Esp32Cam deleted successfully.")
}

// --- Data Fetching
const fetchData = async () => {
    await rwnctx(fetchGH)
    await Promise.all([
        rwnctx(fetchPerms),
        rwnctx(fetchEsp32Cams),
    ])
    ssred.value = ssred.value || import.meta.server
}

onBeforeMount(fetchData)
onServerPrefetch(fetchData)

//

</script>

<style lang="scss" scoped></style>
