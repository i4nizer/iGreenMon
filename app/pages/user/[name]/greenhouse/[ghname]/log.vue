<template>
    <v-container fluid class="bg-container pa-5 py-7">
        <v-row>
            <v-col>
                <h3>Greenhouse Log</h3>
            </v-col>
        </v-row>
        <v-row>
            <!-- Log Pagination -->
            <v-col class="px-3 py-1" cols="12">
                <v-select
                    chips
                    multiple
                    hide-details
                    label="Level"
                    v-model="pagination.levels"
                    :items="LogLevel"
                    @update:model-value="onUpdatePagination"
                ></v-select>
            </v-col>
            <v-col class="px-3 py-1" cols="12" sm="6">
                <v-select
                    chips
                    hide-details
                    label="Limit"
                    v-model="pagination.limit"
                    :items="[25, 50, 100, 200, 500]"
                    @update:model-value="onUpdatePagination"
                ></v-select>
            </v-col>
            <v-col class="px-3 py-1" cols="12" sm="6">
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
            <v-col cols="12">
                <!-- Log Lists -->
                <log-table :logs="filteredLogs" ></log-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import type { Greenhouse } from '~~/shared/schema/greenhouse'
import { LogLevel, type Log } from '~~/shared/schema/log'

//

// --- Preserve nuxt context between awaits
const nctx = useNuxtApp()
const rwnctx = nctx.runWithContext

// --- User
const userUtil = useUser()
const { user } = userUtil

// --- Notif
const toastUtil = useToast()

// --- Route Data
const route = useRoute()
const ghname = route.params?.ghname as string

// --- SSR'ed state
const ssred = useState<boolean>(`${ghname}-log`, () => false)
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

// --- Log
const logUtil = useLog()
const logStore = useLogStore()
const { logs } = logStore

const fetchLog = async () => {
    if (!isOwnGH.value && !canAccess("Log", permissions)) return
    if (ssred.value) return
    const res = await logUtil.retrieveAllByGH(ghname)
	if (!res.success) return toastUtil.error(res.error)
    logs.splice(0, logs.length)
    logs.push(...res.data)
}

// --- Log Pagination
const filteredLogs = computed(() =>
    logs.filter((l) => pagination.levels.includes(l.level))
)
const { execute: paginate } = useDebounce(() => onPaginateCallback(), 500)

const pagination = reactive({
    page: 0,
    count: 0,
    range: [new Date(Date.now() - 24 * 60 * 60 * 1000), new Date()],
    limit: 25,
    offset: 0,
    levels: LogLevel,
})

const onUpdatePagination = () => paginate()

const onPaginateCallback = async () => {
    const alpha = pagination.range.at(0)
    const omega = pagination.range.at(-1)

    const res = await logUtil.retrieveAllByGH(
        ghname,
        alpha ? new Date(alpha) : undefined,
        omega ? new Date(omega) : undefined,
        pagination.limit,
        pagination.offset,
    )

    if (!res.success) return toastUtil.error(res.error)
    logs.splice(0, logs.length)
    res.data.forEach((c) => logStore.append(c))
}

// --- Data Fetching
const fetchData = async () => {
    await rwnctx(fetchGH)
    await rwnctx(fetchPerms)
    await rwnctx(fetchLog)
    ssred.value = ssred.value || import.meta.server
}

onBeforeMount(fetchData)
onServerPrefetch(fetchData)

//

</script>

<style scoped>

</style>