<template>
	<v-container fluid class="bg-container pa-5 py-7">
		<v-row>
			<v-col>
				<h3>Esp32 Pin</h3>
			</v-col>
		</v-row>
		<v-row>
			<v-col class="text-end py-0">
				<!-- For creating pin -->
				<v-dialog class="w-100 w-md-50">
					<template #activator="{ props: activatorProps }">
						<v-btn
							v-if="isOwnGH || canCreate(`Pin`, permissions)"
							class="bg-green"
							:="activatorProps"
						>
							<v-icon class="mr-1">mdi-plus</v-icon>
							<span v-if="$vuetify.display.smAndUp">
								New Pin
							</span>
						</v-btn>
					</template>
					<template #default>
						<pin-create-form
							:esp32-id="parseInt(esp32id)"
							class="bg-white rounded"
							@error="(e) => toastUtil.error(e)"
							@success="onCreatePinSuccess"
						/>
					</template>
				</v-dialog>
			</v-col>
		</v-row>
		<v-row>
			<!-- Pin Update Form Dialog -->
			<v-dialog class="w-100 w-md-50" v-model="pinUpdateDialog">
				<template #default>
					<pin-update-form
						class="bg-white rounded"
						:pin="(pinUpdateData as Pin)"
						@error="(e) => toastUtil.error(e)"
						@success="onUpdatePinSuccess"
					/>
				</template>
			</v-dialog>
			<!-- Pin Table -->
			<v-col cols="12">
                <pin-table
                    :pins
                    :hide-edit="!isOwnGH && !canModifyPin"
                    :hide-delete="!isOwnGH && !canDeletePin"
                    @edit="onEditPin"
                    @delete="onDeletePin"
                ></pin-table>
            </v-col>

			<!-- Fallback/emptystate when no pin -->
			<v-col v-if="pins.length <= 0">
				<v-empty-state
					icon="mdi-sprout"
					text="You haven't created any pin yet."
					title="No pin yet"
				></v-empty-state>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import type { Pin } from "~~/shared/schema/pin"
import type { Greenhouse } from "~~/shared/schema/greenhouse"

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
const ssred = useState<boolean>(`${esp32id}-pin`, () => import.meta.server)
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

const canModifyPin = computed(() => canModify("Pin", permissions))
const canDeletePin = computed(() => canDelete("Pin", permissions))

const fetchPins = async () => {
	if (ssred.value) return;
	const esp32Id = parseInt(esp32id)
	const res = await pinUtil.retrieveAll(esp32Id)
	if (!res.success) return toastUtil.error(res.error)
	pins.splice(0, pins.length)
    pins.push(...res.data)
}

// --- For performance, single instance of update form dialog
const pinUpdateData = ref<Pin>()
const pinUpdateDialog = ref(false)

// --- CRUD
const onCreatePinSuccess = (pin: Pin) => {
	pinStore.append(pin)
	toastUtil.success("Pin created successfully.")
}

const onUpdatePinSuccess = (pin: Pin) => {
	pinStore.change(pin)
	toastUtil.success("Pin updated successfully.")
	pinUpdateDialog.value = false
}

const onDeletePinSuccess = (pin: Pin) => {
	pinStore.remove(pin.id)
	toastUtil.success("Pin deleted successfully.")
}

// --- Navigations from the table
const onEditPin = async (pin: Pin, opts: { loading: Ref<boolean> }) => {
	pinUpdateData.value = pin
	pinUpdateDialog.value = true
}

const onDeletePin = async (pin: Pin, opts: { loading: Ref<boolean> }) => {
	opts.loading.value = true
	const res = await pinUtil.destroy(pin.id)
	opts.loading.value = false

	if (!res.success) toastUtil.error(res.error)
	else onDeletePinSuccess(pin)
}

// --- Sequential data fetching on life cycle hooks
const fetchData = async () => {
	await rwnctx(userUtil.whoami)
	await rwnctx(fetchGH)
	await Promise.all([
		rwnctx(fetchPins),
		rwnctx(fetchPerms),
	])
}

onBeforeMount(fetchData)
onServerPrefetch(fetchData)

//

</script>

<style lang="scss" scoped></style>
