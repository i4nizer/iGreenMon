<template>
    <v-container fluid class="bg-container pa-5 py-7">
		<v-row>
			<v-col>
				<h3>Esp32 Dashboard</h3>
			</v-col>
		</v-row>
        <v-row> 
            <v-col 
                v-for="sensor in sensors"
                cols="12"
                xs="12"
                sm="6"
                md="4"
                xl="3"
                :key="sensor.id"
            >
                <sensor-dashboard-card 
                    :sensor
                    :hide-view="!isOwnGH && !canAccessSensor"
                    @view="onViewSensor"
                >
                    <template #output>
                        <output-dashboard-card
                            v-for="output in getOutputs(sensor.id)"
                            class="border"
                            elevation="0"
                            :output
                            :hide-view="!isOwnGH && !canAccessReading"
                            :last-reading="getLastReading(output.id)"
                            @view="onViewOutput"
                        >
                            <template #reading>
                                <reading-dashboard-sheet
                                    v-if="hasReadings(output.id)"
                                    :readings="getReadings(output.id)"
                                ></reading-dashboard-sheet>
                            </template>
                        </output-dashboard-card>
                    </template>
                </sensor-dashboard-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import type { Greenhouse } from '~~/shared/schema/greenhouse'
import type { Output } from '~~/shared/schema/output'
import type { Sensor } from '~~/shared/schema/sensor'

//

// --- Preserve nuxt context between awaits
const nctx = useNuxtApp()
const rwnctx = nctx.runWithContext

// --- User
const userUtil = useUser()

// --- Notit
const toastUtil = useToast()

// --- Route data
const route = useRoute()
const ghname = route.params.ghname as string
const esp32id = route.params.esp32id as string
const esp32name = route.params.esp32name as string

// --- Greenhouse
const ghUtil = useGreenhouse()
const gh = useState<Greenhouse | undefined>(`gh-${ghname}`)
const isOwnGH = computed(() => gh.value?.userId == userUtil.user.value?.id)

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

// --- Sensors
const sensorUtil = useSensor()
const sensorStore = useSensorStore()
const { sensors } = sensorStore

const canAccessSensor = computed(() => canAccess("Sensor", permissions))

const fetchSensors = async () => {
    if (!isOwnGH.value && !canAccessSensor.value) return
    if (sensors.length > 0) return
    const esp32Id = parseInt(esp32id)
    const res = await sensorUtil.retrieveAll(esp32Id)
    if (!res.success) return toastUtil.error(res.error)
    res.data.forEach((p) => sensorStore.append(p))
}

// --- Sensor Util
const onViewSensor = async (
    sensor: Sensor,
    opts: { loading: Ref<boolean> }
) => {
    const ghUrl = `/user/greenhouse/${ghname}`
    const esp32Url = `/esp32/${esp32id}/${esp32name}/sensor#${sensor.id}`

    opts.loading.value = true
    await navigateTo(ghUrl + esp32Url)
    opts.loading.value = false
}

// --- Outputs
const outputUtil = useOutput()
const outputStore = useOutputStore()
const { outputs } = outputStore

const canAccessOutput = computed(() => canAccess("Output", permissions))

const fetchOutputs = async () => {
    if (!isOwnGH.value && !canAccessOutput.value) return
    if (outputs.length > 0) return
    const esp32Id = parseInt(esp32id)
    const res = await outputUtil.retrieveAllByEsp32(esp32Id)
    if (!res.success) return toastUtil.error(res.error)
    res.data.forEach((p) => outputStore.append(p))
}

// --- Output Util
const getOutputs = (sensorId: number) => {
    return outputs.filter((o) => o.sensorId == sensorId)
}

const onViewOutput = async (
    output: Output,
    opts: { loading: Ref<boolean> }
) => {
    const ghUrl = `/user/greenhouse/${ghname}`
    const esp32Url = `/esp32/${esp32id}/${esp32name}/sensor`

    opts.loading.value = true
    await navigateTo(ghUrl + esp32Url)
    opts.loading.value = false
}

// --- Readings
const readingUtil = useReading()
const readingStore = useReadingStore()
const { readings } = readingStore

const canAccessReading = computed(() => canAccess("Reading", permissions))

const fetchReadings = async () => {
    if (!isOwnGH.value && !canAccessReading.value) return
    if (readings.length > 0) return
    const esp32Id = parseInt(esp32id)
    const res = await readingUtil.retrieveAllByEsp32(esp32Id)
    if (!res.success) return toastUtil.error(res.error)
    res.data.forEach((p) => readingStore.append(p))
}

// --- Reading Util
const hasReadings = (outputId: number) => {
    return readings.some((r) => r.outputId == outputId)
}

const getReadings = (outputId: number) => {
    return readings.filter((r) => r.outputId == outputId)
}

const getLastReading = (outputId: number) => {
    const readings = getReadings(outputId)
        .map((r) => ({ ...r, createdAt: new Date(r.createdAt) }))
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    const reading = readings.at(-1)
    return reading ? reading.value : undefined
}

// --- Data Fetching
const fetchData = async () => {
    await rwnctx(fetchGH)
    await rwnctx(fetchPerms)
    await Promise.all([
        rwnctx(fetchSensors),
        rwnctx(fetchOutputs),
        rwnctx(fetchReadings),
    ])
}

onBeforeMount(fetchData)
onServerPrefetch(fetchData)

//

</script>

<style scoped>

</style>