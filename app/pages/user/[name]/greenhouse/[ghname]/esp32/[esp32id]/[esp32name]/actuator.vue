<template>
	<v-container fluid class="bg-container pa-5 py-7">
		<v-row>
			<v-col>
				<h3>Esp32 Actuator</h3>
			</v-col>
		</v-row>
		<v-row>
			<v-col class="text-end py-0">
				<!-- For creating actuator -->
				<v-dialog class="w-100 w-md-50">
					<template #activator="{ props: activatorProps }">
						<v-btn
							v-if="isOwnGH || canCreate(`Actuator`, permissions)"
							class="bg-green"
							:="activatorProps"
						>
							<v-icon class="mr-1">mdi-plus</v-icon>
							<span v-if="$vuetify.display.smAndUp">
								New Actuator
							</span>
						</v-btn>
					</template>
					<template #default>
						<actuator-create-form
							:esp32-id="gh?.id ?? -1"
							class="bg-white rounded"
							@error="(e) => toastUtil.error(e)"
							@success="onCreateActuatorSuccess"
						/>
					</template>
				</v-dialog>
			</v-col>
		</v-row>
		<v-row>
			<!-- Actuator Update Form Dialog -->
			<v-dialog class="w-100 w-md-50" v-model="actuatorUpdateDialog">
				<template #default>
					<actuator-update-form
						class="bg-white rounded"
						:actuator="(actuatorUpdateData as Actuator)"
						@error="(e) => toastUtil.error(e)"
						@success="onUpdateActuatorSuccess"
					/>
				</template>
			</v-dialog>
			<!-- Actuator List -->
			<v-col 
                v-for="actuator in actuators" 
                xs="12" 
                sm="6" 
                md="4" 
                xl="3" 
                :key="actuator.id"
            >
                <actuator-card
                    :actuator
					@edit="onEditActuator"
					@toggle="onToggleActuator"
					@delete="onDeleteActuator"
                >
					<template #menu="{ onEdit, onDelete, onToggle }">
						<actuator-card-menu
							v-if="isOwnGH || canModifyActuator || canDeleteActuator"
							:actuator
							:hide-edit="!isOwnGH && !canModifyActuator"
							:hide-toggle="!isOwnGH && !canModifyActuator"
							:hide-delete="!isOwnGH && !canDeleteActuator"
							@edit="onEdit"
							@toggle="onToggle"
							@delete="onDelete"
						></actuator-card-menu>
					</template>
				</actuator-card>
            </v-col>

			<!-- Fallback/emptystate when no actuator -->
			<v-col v-if="actuators.length <= 0">
				<v-empty-state
					icon="mdi-sprout"
					text="You haven't created any actuator yet."
					title="No actuator yet"
				></v-empty-state>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import type { Actuator } from "~~/shared/schema/actuator"
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

// --- Actuators
const actuatorUtil = useActuator()
const actuatorStore = useActuatorStore()
const { actuators } = actuatorStore

const canModifyActuator = computed(() => canModify("Actuator", permissions))
const canDeleteActuator = computed(() => canDelete("Actuator", permissions))

const fetchActuators = async () => {
	if (actuators.length > 0) return;
	const req = async () => actuatorUtil.retrieveAll(parseInt(esp32id))
	const res = await rwnctx(req)
	if (!res.success) return toastUtil.error(res.error)
	res.data.forEach((s) => actuatorStore.append(s))
}

// --- Actuator CRUD
const actuatorUpdateData = ref<Actuator>()
const actuatorUpdateDialog = ref(false)

const onEditActuator = async (actuator: Actuator, opts: { loading: Ref<boolean> }) => {
	actuatorUpdateData.value = actuator
	actuatorUpdateDialog.value = true
}

const onToggleActuator = async (actuator: Actuator, opts: { loading: Ref<boolean> }) => {
	opts.loading.value = true
	const res = await actuatorUtil.update(actuator)
	opts.loading.value = false

	if (!res.success) toastUtil.error(res.error)
	else onUpdateActuatorSuccess(actuator)
}

const onDeleteActuator = async (actuator: Actuator, opts: { loading: Ref<boolean> }) => {
	opts.loading.value = true
	const res = await actuatorUtil.destroy(actuator.id)
	opts.loading.value = false

	if (!res.success) toastUtil.error(res.error)
	else onDeleteActuatorSuccess(actuator)
}

const onCreateActuatorSuccess = (actuator: Actuator) => {
	actuatorStore.append(actuator)
	toastUtil.success("Actuator created successfully.")
}

const onUpdateActuatorSuccess = (actuator: Actuator) => {
	actuatorStore.change(actuator)
	toastUtil.success("Actuator updated successfully.")
	actuatorUpdateDialog.value = false
}

const onDeleteActuatorSuccess = (actuator: Actuator) => {
	actuatorStore.remove(actuator.id)
	toastUtil.success("Actuator deleted successfully.")
}

// --- Sequential data fetching on life cycle hooks
const fetchData = async () => {
	await rwnctx(userUtil.whoami)
	await rwnctx(fetchGH)
	await Promise.all([
		rwnctx(fetchPins),
		rwnctx(fetchPerms),
		rwnctx(fetchActuators),
	])
}

onBeforeMount(fetchData)
onServerPrefetch(fetchData)

//

</script>

<style lang="scss" scoped></style>
