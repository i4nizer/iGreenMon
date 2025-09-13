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
							:esp32-id="parseInt(esp32id)"
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
			<!-- Input Create Dialog -->
			<v-dialog class="w-100 w-md-50" v-model="inputCreateDialog">
				<template #default>
					<input-create-form
						class="bg-white rounded"
						:pins
						:actuator-id="inputCreateActuatorId"
						@error="(e) => toastUtil.error(e)"
						@success="onCreateInputSuccess"
					/>
				</template>
			</v-dialog>
			<!-- Input Update Dialog -->
			<v-dialog class="w-100 w-md-50" v-model="inputUpdateDialog">
				<template #default>
					<input-update-form
						class="bg-white rounded"
						:pins
						:input="(inputUpdateData as Input)"
						@error="(e) => toastUtil.error(e)"
						@success="onUpdateInputSuccess"
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
					<template #input>
						<v-list>
							<v-list-subheader class="d-flex justify-end">
								<v-btn 
									v-if="isOwnGH || canCreateInput"
									text="Add Input"
									color="white"
									class="border"
									elevation="0"
									@click="onCreateInput(actuator)"
								></v-btn>
							</v-list-subheader>
							<v-list-item 
								v-if="isOwnGH || canAccessInput"
								v-for="input in inputs.filter((i) => i.actuatorId == actuator.id)"
								:key="input.id"
							>
								<input-card
									:key="input.id"
									:input="input"
									:hide-edit="!isOwnGH && !canModifyInput"
									:hide-delete="!isOwnGH && !canDeleteInput"
									@edit="onEditInput"
									@delete="onDeleteInput"
								/>
							</v-list-item>
							<v-list-item 
								v-if="!inputs.some((i) => i.actuatorId == actuator.id)" 
								class="text-center"
							>
								<span class="text-grey">No Inputs Yet</span>
							</v-list-item>
						</v-list>
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
import type { Input } from "~~/shared/schema/input"

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
const ssred = useState<boolean>(`${esp32id}-actuator`, () => import.meta.server)
onBeforeUnmount(() => ssred.value = false)

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
	if (ssred.value) return;
	const esp32Id = parseInt(esp32id)
	const res = await pinUtil.retrieveAll(esp32Id)
	if (!res.success) return toastUtil.error(res.error)
	pins.splice(0, pins.length)
    pins.push(...res.data)
}

// --- Actuators
const actuatorUtil = useActuator()
const actuatorStore = useActuatorStore()
const { actuators } = actuatorStore

const canModifyActuator = computed(() => canModify("Actuator", permissions))
const canDeleteActuator = computed(() => canDelete("Actuator", permissions))

const fetchActuators = async () => {
	if (ssred.value) return;
	const res = await actuatorUtil.retrieveAll(parseInt(esp32id))
	if (!res.success) return toastUtil.error(res.error)
	actuators.splice(0, actuators.length)
	actuators.push(...res.data)
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

// --- Inputs
const inputUtil = useInput()
const inputStore = useInputStore()
const { inputs } = inputStore

const canAccessInput = computed(() => canAccess("Input", permissions))
const canCreateInput = computed(() => canCreate("Input", permissions))
const canModifyInput = computed(() => canModify("Input", permissions))
const canDeleteInput = computed(() => canDelete("Input", permissions))

const fetchInputs = async () => {
	if (ssred.value) return;
	const esp32Id = parseInt(esp32id)
	const res = await inputUtil.retrieveAllByEsp32(esp32Id)
	if (!res.success) return toastUtil.error(res.error)
	inputs.splice(0, inputs.length)
    inputs.push(...res.data)
}

// --- Input CRUD
const inputCreateDialog = ref(false)
const inputCreateActuatorId = ref<number>(-1)
const inputUpdateData = ref<Input>()
const inputUpdateDialog = ref(false)

const onCreateInput = (actuator: Actuator) => {
	inputCreateActuatorId.value = actuator.id
	inputCreateDialog.value = true
}

const onEditInput = async (input: Input, opts: { loading: Ref<boolean> }) => {
	inputUpdateData.value = input
	inputUpdateDialog.value = true
}

const onDeleteInput = async (input: Input, opts: { loading: Ref<boolean> }) => {
	opts.loading.value = true
	const res = await inputUtil.destroy(input.id)
	opts.loading.value = false

	if (!res.success) return toastUtil.error(res.error)
	else onDeleteInputSuccess(input)
}

const onCreateInputSuccess = (input: Input) => {
	inputStore.append(input)
	toastUtil.success("Input created successfully.")
}

const onUpdateInputSuccess = (input: Input) => {
	inputStore.change(input)
	toastUtil.success("Input updated successfully.")
}

const onDeleteInputSuccess = (input: Input) => {
	inputStore.remove(input.id)
	toastUtil.success("Input deleted successfully.")
}

// --- Sequential data fetching on life cycle hooks
const fetchData = async () => {
	await rwnctx(userUtil.whoami)
	await rwnctx(fetchGH)
	await Promise.all([
		rwnctx(fetchPins),
		rwnctx(fetchPerms),
		rwnctx(fetchActuators),
		rwnctx(fetchInputs),
	])
}

onBeforeMount(fetchData)
onServerPrefetch(fetchData)

//

</script>

<style lang="scss" scoped></style>
