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
            <v-col v-if="captures.length <= 0">
                <v-empty-state
                    icon="mdi-image-off"
                    title="No Images"
                    text="You may try changing the filters."
                ></v-empty-state>
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
import { NPKModelClass } from '~~/shared/types/model/index'
import type { WebSocketEventHandler } from '~/schema/websocket'
import type { Capture } from '~~/shared/schema/capture'
import type { Detection } from '~~/shared/schema/detection'
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
    const esp32CamId = parseInt(esp32camid)
    const alpha = pagination.range.at(0) ?? new Date(Date.now() - 24 * 60 * 60 * 1000)
    const omega = pagination.range.at(-1) ?? new Date()

    const res = await captureUtil.retrieveAllByEsp32Cam(
        esp32CamId,
        alpha ? new Date(alpha) : undefined,
        omega ? new Date(omega) : undefined,
        pagination.limit,
        pagination.offset,
    )

    if (!res.success) return toastUtil.error(res.error)
    captures.splice(0, captures.length)
    const filtered = filterCaptures(
        res.data, 
        detections, 
        alpha, 
        omega, 
        pagination.limit, 
        pagination.classes as any
    )
    filtered.forEach((c) => captureStore.append(c))
}

const filterCaptures = (
    captures: Capture[],
    detections: Detection[],
    alpha: Date,
    omega: Date,
    limit: number,
    classes: NPKModelClass[],
) => { 
    const result: Capture[] = []
    const nolettuce = classes.includes("No Lettuce" as any)
    for (const capture of captures) {
        if (result.length >= limit) break;

        const time = new Date(capture.createdAt).getTime()
        const within = time >= alpha.getTime() && time <= omega.getTime()
        if (!within) continue

        const capdets = detections.filter((d) => d.captureId == capture.id)
        let passclass = capdets.length <= 0 && nolettuce
        passclass = passclass || (capdets.some((d) => classes.includes(d.class as any)) && classes.length > 0)
        if (!passclass) continue
        result.push(capture)
    }
    return result
}

// --- Capture Navs
const captureUrl = `/api/user/greenhouse/esp32-cam/capture`

const onCaptureRaw = (
    capture: Capture,
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
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
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
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
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    opts: { loading: Ref<boolean> }
) => {
    
}

const onCaptureLoad = (
    capture: Capture,
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    opts: { loading: Ref<boolean> }
) => {

}

const onCaptureDraw = (
    capture: Capture,
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    opts: { loading: Ref<boolean> }
) => {
    const bboxes = detections.filter((d) => d.captureId == capture.id)
    if (bboxes.length <= 0) return
    const { width, height } = canvas
    const options = NPKModelClassColor as any
    drawDetectionBBoxes(context, width, height, bboxes, options)
}

// --- Detection
const detectionUtil = useDetection()
const detectionStore = useDetectionStore()
const detectionBBoxRenderer = useDetectionBBoxRenderer()
const { detections } = detectionStore
const { drawDetectionBBoxes } = detectionBBoxRenderer

const canAccessDetection = computed(() => canAccess("Detection", permissions))

const fetchDetections = async () => {
    if (!isOwnGH.value && !canAccessDetection.value) return;
    const esp32CamId = parseInt(esp32camid)
    const res = await detectionUtil.retrieveAllByEsp32Cam(esp32CamId)
    if (!res.success) return toastUtil.error(res.error)
	detections.splice(0, detections.length)
    detections.push(...res.data)
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
    const alpha = pagination.range.at(0) ?? new Date(Date.now() - 24 * 60 * 60 * 1000)
    const omega = pagination.range.at(-1) ?? new Date()

    const res = await captureUtil.retrieveAllByEsp32Cam(
        esp32CamId,
        alpha ? new Date(alpha) : undefined,
        omega ? new Date(omega) : undefined,
        pagination.limit,
        pagination.offset,
    )

    if (!res.success) return toastUtil.error(res.error)
    captures.splice(0, captures.length)
    const filtered = filterCaptures(
        res.data, 
        detections, 
        alpha, 
        omega, 
        pagination.limit, 
        pagination.classes as any
    )
    filtered.forEach((c) => captureStore.append(c))
}

// --- WebSocket Syncing
const dataWebSocket = useDataWebSocket("/api/user/websocket/data", {
    onError: (ws, event) => toastUtil.error(`Something went wrong.`),
})

const onWSCreateCapture: WebSocketEventHandler<Capture> = (ws, data) => {
    if (!isOwnGH.value && !canAccessCapture.value) return
    if (captures.length >= pagination.limit) return
    
    const now = new Date()
    const alpha = pagination.range.at(0)
    const omega = pagination.range.at(-1)
    const ranged =
        (!alpha || (alpha && alpha <= now)) ||
        (!omega || (omega && omega >= now))
    if (!ranged) return

    const esp32CamId = parseInt(esp32camid)
    for (const c of data) {
        if (c.esp32CamId != esp32CamId) continue
        captures.push(c)
    }
}

const onWSCreateDetection: WebSocketEventHandler<Detection> = (ws, data) => {
    if (!isOwnGH.value && !canAccessCapture.value) return

    const now = new Date()
    const alpha = pagination.range.at(0)
    const omega = pagination.range.at(-1)
    const ranged =
        (!alpha || (alpha && alpha <= now)) ||
        (!omega || (omega && omega >= now))
    if (!ranged) return

    for (const d of data) {
        const included = captures.some((c) => c.id == d.captureId)
        if (included) detections.push(d)
    }
}

const openWebSocket = () => {
    dataWebSocket.listen("capture", "Create", onWSCreateCapture)
    dataWebSocket.listen("detection", "Create", onWSCreateDetection)
    dataWebSocket.open()
}

onBeforeMount(openWebSocket)
onBeforeUnmount(() => dataWebSocket.close())

// --- Data Fetching
const fetchData = async () => {
    await rwnctx(fetchGH)
    await rwnctx(fetchPerms)
    await Promise.all([
        rwnctx(fetchCaptures),
        rwnctx(fetchDetections),
    ])
}

onBeforeMount(fetchData)
onServerPrefetch(fetchData)

//

</script>

<style scoped>

</style>