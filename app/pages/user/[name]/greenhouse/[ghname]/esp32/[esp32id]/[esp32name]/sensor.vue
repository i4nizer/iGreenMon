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
							:esp32-id="gh?.id ?? -1"
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
import type { Permission } from "~~/shared/schema/permission"
import type { Output } from "~~/shared/schema/output"

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

// --- Greenhouse
const ghUtil = useGreenhouse()
const gh = useState<Greenhouse | undefined>(`greenhouse`)

const isOwnGH = computed(() => gh.value?.userId == userUtil.user.value?.id)

const fetchGH = async () => {
	const req = async () => await ghUtil.retrieve(ghname)
	const res = await rwnctx(req)
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
	const req = async () => await permUtil.retrieveAll(ghname)
	const res = await rwnctx(req)
	if (!res.success) return toastUtil.error(res.error)
	res.data.forEach((p) => permStore.append(p))
}

// --- Pins
const pinUtil = usePin()
const pinStore = usePinStore()
const { pins } = pinStore

const fetchPins = async () => {
	if (pins.length > 0) return;
	const esp32Id = parseInt(esp32id)
	const req = () => pinUtil.retrieveAll(esp32Id)
	const res = await rwnctx(req)
	if (!res.success) return toastUtil.error(res.error)
	res.data.forEach((p) => pinStore.append(p))
}

// --- Sensors
const sensorUtil = useSensor()
const sensorStore = useSensorStore()
const { sensors } = sensorStore

const canModifySensor = computed(() => canModify("Sensor", permissions))
const canDeleteSensor = computed(() => canDelete("Sensor", permissions))

const fetchSensors = async () => {
	if (sensors.length > 0) return;
	const req = async () => sensorUtil.retrieveAll(parseInt(esp32id))
	const res = await rwnctx(req)
	if (!res.success) return toastUtil.error(res.error)
	res.data.forEach((s) => sensorStore.append(s))
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
	if (outputs.length > 0) return;
	const esp32Id = parseInt(esp32id)
	const req = async () => await outputUtil.retrieveAllByEsp32(esp32Id)
	const res = await rwnctx(req)
	if (!res.success) return toastUtil.error(res.error)
	res.data.forEach((o) => outputStore.append(o))
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

// --- Sequential data fetching on life cycle hooks
const fetchData = async () => {
	await rwnctx(userUtil.whoami)
	await rwnctx(fetchGH)
	await Promise.all([
		rwnctx(fetchPins),
		rwnctx(fetchPerms),
		rwnctx(fetchSensors),
		rwnctx(fetchOutputs),
	])
}

onBeforeMount(fetchData)
onServerPrefetch(fetchData)

//

</script>

<style lang="scss" scoped></style>
