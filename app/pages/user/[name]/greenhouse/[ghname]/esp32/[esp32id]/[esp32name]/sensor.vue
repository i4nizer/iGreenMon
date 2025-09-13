<template>
	<v-container fluid class="bg-container pa-5 py-7">
		<v-row>
			<v-col>
				<h3>Esp32 Sensor</h3>
			</v-col>
		</v-row>
		<v-row>
			<v-col class="text-end py-0">
				<!-- For creating sensor -->
				<v-dialog class="w-100 w-md-50">
					<template #activator="{ props: activatorProps }">
						<v-btn
							v-if="isOwnGH || canCreate(`Sensor`, permissions)"
							class="bg-green"
							:="activatorProps"
						>
							<v-icon class="mr-1">mdi-plus</v-icon>
							<span v-if="$vuetify.display.smAndUp">
								New Sensor
							</span>
						</v-btn>
					</template>
					<template #default>
						<sensor-create-form
							:esp32-id="parseInt(esp32id)"
							class="bg-white rounded"
							@error="(e) => toastUtil.error(e)"
							@success="onCreateSensorSuccess"
						/>
					</template>
				</v-dialog>
			</v-col>
		</v-row>
		<v-row>
			<!-- Sensor Update Form Dialog -->
			<v-dialog class="w-100 w-md-50" v-model="sensorUpdateDialog">
				<template #default>
					<sensor-update-form
						class="bg-white rounded"
						:sensor="(sensorUpdateData as Sensor)"
						@error="(e) => toastUtil.error(e)"
						@success="onUpdateSensorSuccess"
					/>
				</template>
			</v-dialog>
			<!-- Output Create Dialog -->
			<v-dialog class="w-100 w-md-50" v-model="outputCreateDialog">
				<template #default>
					<output-create-form
						class="bg-white rounded"
						:pins
						:sensor-id="outputCreateSensorId"
						@error="(e) => toastUtil.error(e)"
						@success="onCreateOutputSuccess"
					/>
				</template>
			</v-dialog>
			<!-- Output Update Dialog -->
			<v-dialog class="w-100 w-md-50" v-model="outputUpdateDialog">
				<template #default>
					<output-update-form
						class="bg-white rounded"
						:pins
						:output="(outputUpdateData as Output)"
						@error="(e) => toastUtil.error(e)"
						@success="onUpdateOutputSuccess"
					/>
				</template>
			</v-dialog>
			<!-- Hook Create Dialog -->
			<v-dialog class="w-100 w-md-50" v-model="hookCreateDialog">
				<template #default>
					<hook-create-form
						class="bg-white rounded"
						:actions
						:sensor-id="hookCreateSensorId"
						@error="(e) => toastUtil.error(e)"
						@success="onCreateHookSuccess"
					/>
				</template>
			</v-dialog>
			<!-- Hook Update Dialog -->
			<v-dialog class="w-100 w-md-50" v-model="hookUpdateDialog">
				<template #default>
					<hook-update-form
						class="bg-white rounded"
						:actions
						:hook="(hookUpdateData as Hook)"
						@error="(e) => toastUtil.error(e)"
						@success="onUpdateHookSuccess"
					/>
				</template>
			</v-dialog>
			<!-- Sensor List -->
			<v-col 
                v-for="sensor in sensors" 
                xs="12" 
                sm="6" 
                md="4" 
                xl="3" 
                :key="sensor.id"
            >
                <sensor-card
                    :sensor
					@edit="onEditSensor"
					@toggle="onToggleSensor"
					@delete="onDeleteSensor"
                >
					<template #menu="{ onEdit, onDelete, onToggle }">
						<sensor-card-menu
							v-if="isOwnGH || canModifySensor || canDeleteSensor"
							:sensor
							:hide-edit="!isOwnGH && !canModifySensor"
							:hide-toggle="!isOwnGH && !canModifySensor"
							:hide-delete="!isOwnGH && !canDeleteSensor"
							@edit="onEdit"
							@toggle="onToggle"
							@delete="onDelete"
						></sensor-card-menu>
					</template>
					<template #output>
						<v-list>
							<v-list-subheader class="d-flex justify-end">
								<v-btn 
									v-if="isOwnGH || canCreateOutput"
									text="Add Output"
									color="white"
									class="border"
									elevation="0"
									@click="onCreateOutput(sensor)"
								></v-btn>
							</v-list-subheader>
							<v-list-item 
								v-if="isOwnGH || canAccessOutput"
								v-for="output in outputs.filter((o) => o.sensorId == sensor.id)"
								:key="output.id"
							>
								<output-card
									:key="output.id"
									:output="output"
									:hide-edit="!isOwnGH && !canModifyOutput"
									:hide-delete="!isOwnGH && !canDeleteOutput"
									@edit="onEditOutput"
									@delete="onDeleteOutput"
								/>
							</v-list-item>
							<v-list-item 
								v-if="!outputs.some((o) => o.sensorId == sensor.id)" 
								class="text-center"
							>
								<span class="text-grey">No Outputs Yet</span>
							</v-list-item>
						</v-list>
					</template>
					<template #hook>
						<v-list>
							<v-list-subheader class="d-flex justify-end">
								<v-btn 
									v-if="isOwnGH || canCreateHook"
									text="Add Hook"
									color="white"
									class="border"
									elevation="0"
									@click="onCreateHook(sensor)"
								></v-btn>
							</v-list-subheader>
							<v-list-item 
								v-if="isOwnGH || canAccessHook"
								v-for="hook in hooks.filter((h) => h.sensorId == sensor.id)"
								:key="hook.id"
							>
								<hook-card
									v-if="actions.some((a) => a.id == hook.actionId)"
									:key="hook.id"
									:hook="hook"
									:action="(actions.find((a) => a.id == hook.actionId) as Action)"
									:hide-edit="!isOwnGH && !canModifyHook"
									:hide-delete="!isOwnGH && !canDeleteHook"
									@edit="onEditHook"
									@delete="onDeleteHook"
								/>
							</v-list-item>
							<v-list-item 
								v-if="!hooks.some((o) => o.sensorId == sensor.id)" 
								class="text-center"
							>
								<span class="text-grey">No Hooks Yet</span>
							</v-list-item>
						</v-list>
					</template>
				</sensor-card>
            </v-col>

			<!-- Fallback/emptystate when no sensor -->
			<v-col v-if="sensors.length <= 0">
				<v-empty-state
					icon="mdi-sprout"
					text="You haven't created any sensor yet."
					title="No sensor yet"
				></v-empty-state>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import type { Sensor } from "~~/shared/schema/sensor"
import type { Greenhouse } from "~~/shared/schema/greenhouse"
import type { Output } from "~~/shared/schema/output"
import type { Hook } from "~~/shared/schema/hook"
import type { Action } from "~~/shared/schema/action"

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

// --- SSR'ed state
const ssred = useState<boolean>(`${esp32id}-sensor`, () => import.meta.server)
onBeforeUnmount(() => ssred.value = false)

// --- Greenhouse
const ghUtil = useGreenhouse()
const gh = useState<Greenhouse | undefined>(`greenhouse`)

const isOwnGH = computed(() => gh.value?.userId == userUtil.user.value?.id)

const fetchGH = async () => {
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

// --- Pins
const pinUtil = usePin()
const pinStore = usePinStore()
const { pins } = pinStore

const canAccessPin = computed(() => canAccess("Pin", permissions))

const fetchPins = async () => {
	if (!isOwnGH && !canAccessPin.value) return
	if (ssred.value) return;
	const esp32Id = parseInt(esp32id)
	const res = await pinUtil.retrieveAll(esp32Id)
	if (!res.success) return toastUtil.error(res.error)
	pins.splice(0, pins.length)
    pins.push(...res.data)
}

// --- Sensors
const sensorUtil = useSensor()
const sensorStore = useSensorStore()
const { sensors } = sensorStore

const canAccessSensor = computed(() => canAccess("Sensor", permissions))
const canModifySensor = computed(() => canModify("Sensor", permissions))
const canDeleteSensor = computed(() => canDelete("Sensor", permissions))

const fetchSensors = async () => {
	if (!isOwnGH && !canAccessSensor.value) return
	if (ssred.value) return;
	const res = await sensorUtil.retrieveAll(parseInt(esp32id))
	if (!res.success) return toastUtil.error(res.error)
	sensors.splice(0, sensors.length)
    sensors.push(...res.data)
}

// --- Sensor CRUD
const sensorUpdateData = ref<Sensor>()
const sensorUpdateDialog = ref(false)

const onEditSensor = async (sensor: Sensor, opts: { loading: Ref<boolean> }) => {
	sensorUpdateData.value = sensor
	sensorUpdateDialog.value = true
}

const onToggleSensor = async (sensor: Sensor, opts: { loading: Ref<boolean> }) => {
	opts.loading.value = true
	const res = await sensorUtil.update(sensor)
	opts.loading.value = false

	if (!res.success) toastUtil.error(res.error)
	else onUpdateSensorSuccess(sensor)
}

const onDeleteSensor = async (sensor: Sensor, opts: { loading: Ref<boolean> }) => {
	opts.loading.value = true
	const res = await sensorUtil.destroy(sensor.id)
	opts.loading.value = false

	if (!res.success) toastUtil.error(res.error)
	else onDeleteSensorSuccess(sensor)
}

const onCreateSensorSuccess = (sensor: Sensor) => {
	sensorStore.append(sensor)
	toastUtil.success("Sensor created successfully.")
}

const onUpdateSensorSuccess = (sensor: Sensor) => {
	sensorStore.change(sensor)
	toastUtil.success("Sensor updated successfully.")
	sensorUpdateDialog.value = false
}

const onDeleteSensorSuccess = (sensor: Sensor) => {
	sensorStore.remove(sensor.id)
	toastUtil.success("Sensor deleted successfully.")
}

// --- Outputs
const outputUtil = useOutput()
const outputStore = useOutputStore()
const { outputs } = outputStore

const canAccessOutput = computed(() => canAccess("Output", permissions))
const canCreateOutput = computed(() => canCreate("Output", permissions))
const canModifyOutput = computed(() => canModify("Output", permissions))
const canDeleteOutput = computed(() => canDelete("Output", permissions))

const fetchOutputs = async () => {
	if (!isOwnGH && !canAccessOutput.value) return
	if (ssred.value) return;
	const esp32Id = parseInt(esp32id)
	const res = await outputUtil.retrieveAllByEsp32(esp32Id)
	if (!res.success) return toastUtil.error(res.error)
	outputs.splice(0, outputs.length)
    outputs.push(...res.data)
}

// --- Output CRUD
const outputCreateDialog = ref(false)
const outputCreateSensorId = ref<number>(-1)
const outputUpdateData = ref<Output>()
const outputUpdateDialog = ref(false)

const onCreateOutput = (sensor: Sensor) => {
	outputCreateSensorId.value = sensor.id
	outputCreateDialog.value = true
}

const onEditOutput = async (output: Output, opts: { loading: Ref<boolean> }) => {
	outputUpdateData.value = output
	outputUpdateDialog.value = true
}

const onDeleteOutput = async (output: Output, opts: { loading: Ref<boolean> }) => {
	opts.loading.value = true
	const res = await outputUtil.destroy(output.id)
	opts.loading.value = false

	if (!res.success) return toastUtil.error(res.error)
	else onDeleteOutputSuccess(output)
}

const onCreateOutputSuccess = (output: Output) => {
	outputStore.append(output)
	toastUtil.success("Output created successfully.")
}

const onUpdateOutputSuccess = (output: Output) => {
	outputStore.change(output)
	toastUtil.success("Output updated successfully.")
}

const onDeleteOutputSuccess = (output: Output) => {
	outputStore.remove(output.id)
	toastUtil.success("Output deleted successfully.")
}

// --- Actions
const actionUtil = useAction()
const actionStore = useActionStore()
const { actions } = actionStore

const canAccessAction = computed(() => canAccess("Action", permissions))

const fetchActions = async () => {
	if (!isOwnGH && !canAccessAction.value) return
	if (!gh.value || ssred.value) return;
	const res = await actionUtil.retrieveAll(gh.value.id)
	if (!res.success) return toastUtil.error(res.error)
	actions.splice(0, actions.length)
    actions.push(...res.data)
}

// --- Hooks
const hookUtil = useHook()
const hookStore = useHookStore()
const { hooks } = hookStore

const canAccessHook = computed(() => canAccess("Hook", permissions))
const canCreateHook = computed(() => canCreate("Hook", permissions))
const canModifyHook = computed(() => canModify("Hook", permissions))
const canDeleteHook = computed(() => canDelete("Hook", permissions))

const fetchHooks = async () => {
	if (!isOwnGH && !canAccessHook.value) return;
	if (ssred) return;
	const esp32Id = parseInt(esp32id)
	const res = await hookUtil.retrieveAllByEsp32(esp32Id)
	if (!res.success) return toastUtil.error(res.error)
	hooks.splice(0, hooks.length)
    hooks.push(...res.data)
}

// --- Hook CRUD
const hookCreateDialog = ref(false)
const hookCreateSensorId = ref<number>(-1)
const hookUpdateData = ref<Hook>()
const hookUpdateDialog = ref(false)

const onCreateHook = (sensor: Sensor) => {
	hookCreateSensorId.value = sensor.id
	hookCreateDialog.value = true
}

const onEditHook = async (hook: Hook, opts: { loading: Ref<boolean> }) => {
	hookUpdateData.value = hook
	hookUpdateDialog.value = true
}

const onDeleteHook = async (hook: Hook, opts: { loading: Ref<boolean> }) => {
	opts.loading.value = true
	const res = await hookUtil.destroy(hook.id)
	opts.loading.value = false

	if (!res.success) return toastUtil.error(res.error)
	else onDeleteHookSuccess(hook)
}

const onCreateHookSuccess = (hook: Hook) => {
	hookStore.append(hook)
	toastUtil.success("Hook created successfully.")
}

const onUpdateHookSuccess = (hook: Hook) => {
	hookStore.change(hook)
	toastUtil.success("Hook updated successfully.")
}

const onDeleteHookSuccess = (hook: Hook) => {
	hookStore.remove(hook.id)
	toastUtil.success("Hook deleted successfully.")
}

// --- Sequential data fetching on life cycle hooks
const fetchData = async () => {
	await rwnctx(userUtil.whoami)
	await rwnctx(fetchGH)
	await Promise.all([
		rwnctx(fetchPins),
		rwnctx(fetchPerms),
		rwnctx(fetchSensors),
		rwnctx(fetchOutputs),
		rwnctx(fetchActions),
		rwnctx(fetchHooks),
	])
}

onBeforeMount(fetchData)
onServerPrefetch(fetchData)

//

</script>

<style lang="scss" scoped></style>
