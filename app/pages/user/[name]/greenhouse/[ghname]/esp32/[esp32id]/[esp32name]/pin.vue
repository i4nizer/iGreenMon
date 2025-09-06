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
							@error="(e) => toast.error(e)"
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
						@error="(e) => toast.error(e)"
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

// --- Utils
const route = useRoute()
const toast = useToast()
const ghUtil = useGreenhouse()
const pinUtil = usePin()
const userUtil = useUser({ hydrate: false })

// --- Store
const pinStore = usePinStore()

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
const canModifyPin = computed(() => canModify("Pin", permissions))
const canDeletePin = computed(() => canDelete("Pin", permissions))

// --- Data
const { user } = userUtil
const { pins } = pinStore

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

    if (gh.value && pins.length <= 0) {
		const req = async () => pinUtil.retrieveAll(parseInt(esp32id))
		const res = await rwnctx(req)
		if (res.success) res.data.forEach((e) => pinStore.append(e))
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
const pinUpdateData = ref<Pin>()
const pinUpdateDialog = ref(false)

// --- CRUD
const onCreatePinSuccess = (pin: Pin) => {
	pinStore.append(pin)
	toast.success("Pin created successfully.")
}

const onUpdatePinSuccess = (pin: Pin) => {
	pinStore.change(pin)
	toast.success("Pin updated successfully.")
	pinUpdateDialog.value = false
}

const onDeletePinSuccess = (pin: Pin) => {
	pinStore.remove(pin.id)
	toast.success("Pin deleted successfully.")
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

	if (!res.success) toast.error(res.error)
	else onDeletePinSuccess(pin)
}

//

</script>

<style lang="scss" scoped></style>
