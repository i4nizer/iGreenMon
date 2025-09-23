<template>
    <v-container fluid class="bg-container pa-5 py-7">
        <v-row>
            <v-col>
                <h3>Greenhouse Statistics</h3>
            </v-col>
        </v-row>
        <v-row>
            <!-- Reading Pagination -->
            <v-col class="pl-3 py-1" cols="12" sm="6">
                <v-select
                    chips
                    hide-details
                    label="Limit"
                    v-model="pagination.limit"
                    :items="[25, 50, 100, 200, 500]"
                    @update:model-value="onUpdatePagination"
                ></v-select>
            </v-col>
            <v-col class="pr-3 py-1" cols="12" sm="6">
                <v-date-input
                    hide-details
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
            <!-- Reading Charts -->
            <v-col 
                v-for="output in outputs"
                cols="12" 
                xs="12" 
                xl="6"
                class="d-flex flex-column ga-0"
                :key="output.id"
            >
                <div 
                    class="d-flex align-center justify-space-between px-5 py-2 bg-green-darken-4"
                    style="z-index: 1"
                >
                    <strong>{{ output.name }}</strong>
                    <div class="d-flex ga-1">
                        <v-btn
                            size="small"
                            icon="mdi-download"
                            class="bg-transparent"
                            elevation="0"
                            v-tooltip="`CSV Download`"
                            @click="onClickCsvDownload(output.id)"
                        ></v-btn>
                        <v-btn
                            size="small"
                            icon="mdi-download-multiple"
                            class="bg-transparent"
                            elevation="0"
                            v-tooltip="`CSV Download All`"
                            @click="onClickCsvDownloadAll(output.id)"
                        ></v-btn>
                    </div>
                </div>
                <reading-line-chart
                    style="z-index: 1"
                    class="bg-white border pa-2 pl-5 pr-10"
                    :label="output.name"
                    :readings="readings.filter((r) => r.outputId == output.id)"
                ></reading-line-chart>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
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
const ghname = routeUtil.params?.ghname as string

// --- SSR'ed state
const ssred = useState<boolean>(`${ghname}-statistic`, () => false)
onBeforeUnmount(() => ssred.value = false)

// --- Greenhouse
const ghUtil = useGreenhouse()
const gh = useState<Greenhouse | undefined>(`gh-${ghname}`)
const isOwnGH = computed(() => gh.value?.userId == user.value?.id)

const fetchGH = async () => {
    if (gh.value) return
	const res = await ghUtil.retrieve(ghname)
	if (!res.success) return toastUtil.error(res.error)
	gh.value = res.data
}

// --- Permissions
const permUtil = usePermission()
const permStore = usePermissionStore()
const { permissions } = permStore
const { canAccess } = permUtil

const fetchPerms = async () => {
	if (isOwnGH.value || permissions.length > 0) return;
	const res = await permUtil.retrieveAll(ghname)
	if (!res.success) return toastUtil.error(res.error)
	res.data.forEach((p) => permStore.append(p))
}

// --- Outputs
const outputUtil = useOutput()
const outputStore = useOutputStore()
const { outputs } = outputStore
const canAccessOutput = computed(() => canAccess("Output", permissions))

const fetchOutputs = async (force: boolean = false) => {
    if (!isOwnGH.value && !canAccessOutput.value) return
    if (!force && ssred.value) return
    const res = await outputUtil.retrieveAllByGH(ghname)
    if (!res.success) return toastUtil.error(res.error)
    outputs.splice(0, outputs.length)
    res.data.forEach((o) => outputStore.append(o))
}

// --- Reading
const readingUtil = useReading()
const readingStore = useReadingStore()
const { readings } = readingStore
const canAccessReading = computed(() => canAccess("Reading", permissions))

const fetchReadings = async (force: boolean = false) => {
    if (!isOwnGH.value && !canAccessReading.value) return
    if (!force && ssred.value) return

    const alpha = pagination.range.at(0)
    const omega = pagination.range.at(-1)

    const res = await readingUtil.retrieveAllByGH(
        ghname,
        alpha ? new Date(alpha) : undefined,
        omega ? new Date(omega) : undefined,
        pagination.limit,
        pagination.offset,
    )

    if (!res.success) return toastUtil.error(res.error)
    readings.splice(0, readings.length)
    res.data.forEach((r) => readingStore.append(r))
}

// --- Reading CSV
const readingCsv = useReadingCsv()

const onClickCsvDownload = async (outputId: number) => {
    const alpha = pagination.range.at(0)
    const omega = pagination.range.at(-1)

    const res = await readingCsv.downloadByOutput(
        outputId,
        alpha ? new Date(alpha) : undefined,
        omega ? new Date(omega) : undefined,
        pagination.limit,
        pagination.offset,
    )

    if (!res.success) return toastUtil.error(res.error)

    const link = URL.createObjectURL(res.data)
    const a = document.createElement("a")
    a.href = link
    a.download = `readings.csv`
    
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(link)
}

const onClickCsvDownloadAll = async (outputId: number) => {
    const res = await readingCsv.downloadByOutput(outputId)
    if (!res.success) return toastUtil.error(res.error)

    const link = URL.createObjectURL(res.data)
    const a = document.createElement("a")
    a.href = link
    a.download = `readings.csv`
    
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(link)
}

// --- Reading Pagination
const { execute: onUpdatePagination } = useDebounce(() => fetchReadings(true), 500)

const pagination = reactive({
    page: 0,
    count: 0,
    range: [new Date(Date.now() - 24 * 60 * 60 * 1000), new Date()],
    limit: 25,
    offset: 0,
})

// --- Data Fetching
const fetchData = async () => {
    await rwnctx(fetchGH)
    await rwnctx(fetchPerms)
    await Promise.all([
        rwnctx(fetchOutputs),
        rwnctx(fetchReadings),
    ])
    ssred.value = ssred.value || import.meta.server
}

onBeforeMount(fetchData)
onServerPrefetch(fetchData)

//

</script>

<style scoped>

</style>