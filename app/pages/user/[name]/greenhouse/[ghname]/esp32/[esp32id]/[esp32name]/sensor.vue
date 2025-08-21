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
							@error="(e) => toast.error(e)"
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
						@error="(e) => toast.error(e)"
						@success="onUpdateSensorSuccess"
					/>
				</template>
			</v-dialog>
			<!-- Sensor List -->
			<v-col 
                v-for="sensor in sensors" 
                xs="12" 
                sm="6" 
                md="4" 
                lg="3" 
                xl="2"
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

//

// --- Utils
const route = useRoute()
const toast = useToast()
const ghUtil = useGreenhouse()
const sensorUtil = useSensor()
const userUtil = useUser({ hydrate: false })

// --- Store
const sensorStore = useSensorStore()

// --- Params
const ghname = route.params.ghname as string
const esp32id = route.params.esp32id as string

// --- Greenhouse Permissions
const permUtil = usePermission()
const { canCreate, canModify, canDelete } = permUtil
const permStore = usePermissionStore()
const { permissions } = permStore

const gh = useState<Greenhouse | undefined>(`gh-${ghname}`, () => undefined)
const isOwnGH = computed(() => gh.value?.userId == user.value?.id)
const canModifySensor = computed(() => canModify("Sensor", permissions))
const canDeleteSensor = computed(() => canDelete("Sensor", permissions))

// --- Data
const { user } = userUtil
const { sensors } = sensorStore

const fetchData = async () => {
	// --- Preserve nuxt context between awaits
	const nctx = useNuxtApp()
	const rwnctx = nctx.runWithContext
	if (!user.value) await rwnctx(userUtil.whoami)

	if (!gh.value) {
		const req = async () => await ghUtil.retrieve(ghname)
		const res = await rwnctx(req)
		if (res.success) gh.value = res.data
		else toast.error(res.error)
	}

    if (gh.value && sensors.length <= 0) {
		const req = async () => sensorUtil.retrieveAll(parseInt(esp32id))
		const res = await rwnctx(req)
		if (res.success) res.data.forEach((e) => sensorStore.append(e))
		else toast.error(res.error)
	}

	if (!isOwnGH.value && permissions.length <= 0) {
		const req = async () => await permUtil.retrieveAll(ghname)
		const res = await rwnctx(req)
		if (res.success) res.data.forEach((p) => permStore.append(p))
		else toast.error(res.error)
	}
}

onBeforeMount(fetchData)
onServerPrefetch(fetchData)

// --- For performance, single instance of update form dialog
const sensorUpdateData = ref<Sensor>()
const sensorUpdateDialog = ref(false)

// --- CRUD
const onCreateSensorSuccess = (sensor: Sensor) => {
	sensorStore.append(sensor)
	toast.success("Sensor created successfully.")
}

const onUpdateSensorSuccess = (sensor: Sensor) => {
	sensorStore.change(sensor)
	toast.success("Sensor updated successfully.")
	sensorUpdateDialog.value = false
}

const onDeleteSensorSuccess = (sensor: Sensor) => {
	sensorStore.remove(sensor.id)
	toast.success("Sensor deleted successfully.")
}

// --- Navigations from the table
const onEditSensor = async (sensor: Sensor, opts: { loading: Ref<boolean> }) => {
	sensorUpdateData.value = sensor
	sensorUpdateDialog.value = true
}

const onToggleSensor = async (sensor: Sensor, opts: { loading: Ref<boolean> }) => {
	opts.loading.value = true
	const res = await sensorUtil.update(sensor)
	opts.loading.value = false

	if (!res.success) toast.error(res.error)
	else onUpdateSensorSuccess(sensor)
}

const onDeleteSensor = async (sensor: Sensor, opts: { loading: Ref<boolean> }) => {
	opts.loading.value = true
	const res = await sensorUtil.destroy(sensor.id)
	opts.loading.value = false

	if (!res.success) toast.error(res.error)
	else onDeleteSensorSuccess(sensor)
}

//

</script>

<style lang="scss" scoped></style>
