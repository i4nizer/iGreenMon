<template>
    <v-container fluid class="bg-container pa-5 py-7">
        <v-row>
            <v-col>
                <h3>Esp32Cam Capture</h3>
            </v-col>
        </v-row>
        <v-row>
            <!-- Pagination Filters -->
            <v-col class="pa-1" cols="12">
                <v-select
                    chips
                    multiple
                    hide-details
                    label="Class"
                    v-model="pagination.classes"
                    :items="[`No Lettuce`, ...NPKModelClass]"
                    @update:model-value="onUpdatePagination"
                ></v-select>
            </v-col>
            <v-col class="pa-1" cols="12" sm="6">
                <v-select
                    chips
                    hide-details
                    label="Limit"
                    v-model="pagination.limit"
                    :items="[25, 50, 100, 200, 500]"
                    @update:model-value="onUpdatePagination"
                ></v-select>
            </v-col>
            <v-col class="pa-1" cols="12" sm="6">
                <v-date-input
                    label="Range"
                    variant="outlined"
                    density="compact"
                    multiple="range"
                    prepend-icon=""
                    prepend-inner-icon="mdi-calendar"
                    v-model="pagination.range"
                    @update:model-value="onUpdatePagination"
                ></v-date-input>
            </v-col>
        </v-row>
        <v-row>
            <!-- Capture List -->
            <v-col 
                v-if="isOwnGH || canAccessCapture"
                v-for="capture in captures"
                cols="12" 
                xs="12"
                sm="6"
                md="4"
                lg="4"
                xl="3"
                xxl="2"
                :key="capture.id"
            >
                <capture-card
                    :capture
                    @raw="onCaptureRaw"
                    @save="onCaptureSave"
                    @view="onCaptureView"
                    @load="onCaptureLoad"
                    @draw="onCaptureDraw"
                >
                    <template #canvas="{ onImageLoad, onImageDraw, onImageClick }">
                        <image-canvas
                            :src="`${captureUrl}/${capture.filename}`"
                            @load="onImageLoad"
                            @draw="onImageDraw"
                            @click="onImageClick"
                        ></image-canvas>
                    </template>
                </capture-card>
            </v-col>
        </v-row>
        <v-row>
            <!-- Pagination Control -->
            <v-col cols="12">
                <v-pagination 
                    v-model="pagination.page" 
                    :length="pagination.count" 
                    @update:model-value="onUpdatePagination"
                ></v-pagination>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import type { Capture } from '~~/shared/schema/capture'
import type { Greenhouse } from '~~/shared/schema/greenhouse'

//

// --- Nuxt Ctx
const nctx = useNuxtApp()
const rwnctx = nctx.runWithContext

// --- User
const userUtil = useUser()
const { user } = userUtil

// --- Notif
const toastUtil = useToast()

// --- Route data
const route = useRoute()
const ghname = route.params.ghname as string
const esp32camid = route.params.esp32camid as string

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

// --- Capture
const captureUtil = useCapture()
const captureStore = useCaptureStore()
const { captures } = captureStore

const canAccessCapture = computed(() => canAccess("Capture", permissions))

const fetchCaptures = async () => {
    if (!isOwnGH.value && !canAccessCapture.value) return;
    if (captures.length > 0) return
    const esp32CamId = parseInt(esp32camid)
    const res = await captureUtil.retrieveAllByEsp32Cam(esp32CamId)
    if (!res.success) return toastUtil.error(res.error)
	res.data.forEach((c) => captureStore.append(c))
}

// --- Capture Navs
const captureUrl = `/api/user/greenhouse/esp32-cam/capture`

const onCaptureRaw = (
    capture: Capture,
    image: HTMLImageElement,
    opts: { loading: Ref<boolean> }
) => {
    opts.loading.value = true
    const link = document.createElement("a")
    link.href = image.src
    link.download = capture.filename
    link.click()
    opts.loading.value = false
}

const onCaptureSave = (
    capture: Capture,
    canvas: HTMLCanvasElement,
    opts: { loading: Ref<boolean> }
) => {
    opts.loading.value = true

    canvas.toBlob((blob) => {
        if (!blob) return;

        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = capture.filename
        link.click()

        URL.revokeObjectURL(link.href)
        opts.loading.value = false
    }, "jpg", 100)
}

const onCaptureView = (
    capture: Capture,
    canvas: HTMLCanvasElement,
    opts: { loading: Ref<boolean> }
) => {
    
}

const onCaptureLoad = (
    capture: Capture,
    image: HTMLImageElement,
    opts: { loading: Ref<boolean> }
) => {

}

const onCaptureDraw = (
    capture: Capture,
    canvas: HTMLCanvasElement,
    opts: { loading: Ref<boolean> }
) => {
    
}

// --- Pagination
const { execute: paginate } = useDebounce(() => onPaginateCallback(), 500)

const pagination = reactive({
    page: 0,
    count: 0,
    range: [new Date(Date.now() - 24 * 60 * 60 * 1000), new Date()],
    limit: 25,
    offset: 0,
    classes: NPKModelClass,
})

const onUpdatePagination = () => paginate()

const onPaginateCallback = async () => {
    const esp32CamId = parseInt(esp32camid)
    const alpha = pagination.range.at(0)
    const omega = pagination.range.at(-1)

    const res = await captureUtil.retrieveAllByEsp32Cam(
        esp32CamId,
        alpha ? new Date(alpha) : undefined,
        omega ? new Date(omega) : undefined,
        pagination.limit,
        pagination.offset,
    )

    if (!res.success) return toastUtil.error(res.error)
    captures.splice(0, captures.length)
    res.data.forEach((c) => captureStore.append(c))
}

// --- Data Fetching
const fetchData = async () => {
    await rwnctx(fetchGH)
    await rwnctx(fetchPerms)
    await rwnctx(fetchCaptures)
}

onBeforeMount(fetchData)
onServerPrefetch(fetchData)

//

</script>

<style scoped>

</style>