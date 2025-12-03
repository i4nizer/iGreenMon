<template>
    <v-container fluid class="bg-container pa-5 py-7">
        <v-row>
            <v-col>
                <h3>Esp32Cam Dashboard</h3>
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
            <!-- Capture Graph -->
            <v-col cols="12" sm="12" lg="12">
                <CaptureLineGraph 
                    style="z-index: 1"
                    class="bg-white border pa-2 pl-5 pr-10"
                    :label="``"
                    :detections
                ></CaptureLineGraph>
            </v-col>
            <v-col cols="12" sm="12" lg="4">

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
    const alpha = pagination.range.at(0) ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
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
        if (passclass) result.push(capture)
    }

    return result
}

// --- Detection
const detectionUtil = useDetection()
const detectionStore = useDetectionStore()
const { detections } = detectionStore

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
    range: [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()],
    limit: 25,
    offset: 0,
    classes: NPKModelClass,
})

const onUpdatePagination = () => paginate()

const onPaginateCallback = async () => {
    const esp32CamId = parseInt(esp32camid)
    const alpha = pagination.range.at(0) ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
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