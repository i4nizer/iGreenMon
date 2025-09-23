<template>
    <v-container fluid class="bg-container pa-5 py-7">
        <v-row>
            <v-col>
                <h3>Greenhouse Action</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-end py-0">
                <!-- For creating action -->
                <v-dialog class="w-100 w-md-50">
                    <template #activator="{ props: activatorProps }">
                        <v-btn 
                            v-if="isOwnGH || canCreateAction" 
                            class="bg-green" 
                            :="activatorProps"
                        >
                            <v-icon class="mr-1">mdi-plus</v-icon>
                            <span v-if="$vuetify.display.smAndUp">
                                New Action
                            </span>
                        </v-btn>
                    </template>
                    <template #default>
                        <action-create-form
                            v-if="gh"
                            class="bg-white rounded overflow-auto"
                            :inputs
                            :schedules
                            :thresholds
                            :greenhouse-id="gh.id"
                            @error="(e) => toastUtil.error(e)"
                            @success="onCreateActionSuccess"
                        />
                    </template>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row>
            <!-- Action Update Form Dialog -->
            <v-dialog class="w-100 w-md-50" v-model="actionUpdateDialog">
                <template #default>
                    <action-update-form
                        class="bg-white rounded overflow-auto"
						:inputs
                        :schedules
                        :thresholds
						:action="(actionUpdateData as Action)"
						@error="(e) => toastUtil.error(e)"
						@success="onUpdateActionSuccess"
					/>
                </template>
            </v-dialog>
            <!-- Action Lists -->
            <v-col 
                v-if="isOwnGH || canAccessAction"
                v-for="action in actions" 
                xs="12" 
                sm="6" 
                md="4" 
                lg="3" 
                xl="2"
                :key="action.id"
            >
                <action-card 
                    v-if="inputs.some((i) => i.id == action.inputId)"
                    :input="(inputs.find((i) => i.id == action.inputId) as Input)"
                    :action="action"
                    :hide-edit="!isOwnGH && !canModifyAction"
                    :hide-delete="!isOwnGH && !canDeleteAction"
                    @edit="onEditAction"
                    @delete="onDeleteAction"
                />
            </v-col>
            <!-- Fallback/emptystate when no action -->
            <v-col v-if="actions.length <= 0">
                <v-empty-state
                    icon="mdi-rocket"
                    text="You haven't created any action yet."
                    title="No action yet"
                ></v-empty-state>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import type { Greenhouse } from '~~/shared/schema/greenhouse'
import type { Action } from '~~/shared/schema/action'
import type { Input } from '~~/shared/schema/input'

//

// --- Preserve nuxt context between awaits
const nctx = useNuxtApp()
const rwnctx = nctx.runWithContext

// --- User
const userUtil = useUser()
const { user } = userUtil

// --- Notif
const toastUtil = useToast()

// --- Route data
const route = useRoute()
const ghname = route.params.ghname as string

// --- SSR'ed state
const ssred = useState<boolean>(`${ghname}-action`, () => false)
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
	const res = await permUtil.retrieveAll(ghname)
	if (!res.success) return toastUtil.error(res.error)
	res.data.forEach((p) => permStore.append(p))
}

// --- Schedules
const scheduleUtil = useSchedule()
const scheduleStore = useScheduleStore()
const { schedules } = scheduleStore

const canAccessSchedule = computed(() => canAccess("Schedule", permissions))

const fetchSchedules = async () => {
    if (!isOwnGH && !canAccessSchedule.value) return
    if (!gh.value || ssred.value) return;
    const res = await scheduleUtil.retrieveAll(gh.value.id)
    if (!res.success) return toastUtil.error(res.error)
    schedules.splice(0, schedules.length)
	schedules.push(...res.data)
}

// --- Thresholds
const thresholdUtil = useThreshold()
const thresholdStore = useThresholdStore()
const { thresholds } = thresholdStore

const canAccessThreshold = computed(() => canAccess("Threshold", permissions))

const fetchThresholds = async () => {
    if (!isOwnGH && !canAccessThreshold.value) return
    if (!gh.value || ssred.value) return;
    const res = await thresholdUtil.retrieveAll(gh.value.id)
    if (!res.success) return toastUtil.error(res.error)
    thresholds.splice(0, thresholds.length)
	thresholds.push(...res.data)
}

// --- Inputs
const inputUtil = useInput()
const inputStore = useInputStore()
const { inputs } = inputStore

const canAccessInput = computed(() => canAccess("Input", permissions))

const fetchInputs = async () => {
    if (!isOwnGH && !canAccessInput.value) return;
    if (ssred.value) return;
    const res = await inputUtil.retrieveAllByGH(ghname)
    if (!res.success) return toastUtil.error(res.error)
    inputs.splice(0, inputs.length)
	inputs.push(...res.data)
}

// --- Actions
const actionUtil = useAction()
const actionStore = useActionStore()
const { actions } = actionStore

const canCreateAction = computed(() => canCreate("Action", permissions))
const canAccessAction = computed(() => canAccess("Action", permissions))
const canModifyAction = computed(() => canModify("Action", permissions))
const canDeleteAction = computed(() => canDelete("Action", permissions))

const fetchActions = async () => { 
    if (!isOwnGH && !canAccessAction.value) return
    if (!gh.value || ssred.value) return;
    const res = await actionUtil.retrieveAll(gh.value.id)
    if (!res.success) return toastUtil.error(res.error)
    actions.splice(0, actions.length)
	actions.push(...res.data)
}

// --- Action CRUD
const actionUpdateData = ref<Action>()
const actionUpdateDialog = ref(false)

const onEditAction = async (
    action: Action,
    opts: { loading: Ref<boolean> }
) => {
    actionUpdateData.value = action
    actionUpdateDialog.value = true
}

const onDeleteAction = async (
    action: Action,
    opts: { loading: Ref<boolean> }
) => {
    opts.loading.value = true
    const res = await actionUtil.destroy(action.id)
    opts.loading.value = false

    if (!res.success) toastUtil.error(res.error)
    else onDeleteActionSuccess(action)
}

const onCreateActionSuccess = (action: Action) => {
    actionStore.append(action)
    toastUtil.success("Action created successfully.")
}

const onUpdateActionSuccess = (action: Action) => {
    actionStore.change(action)
    toastUtil.success("Action updated successfully.")
    actionUpdateDialog.value = false
    actionUpdateData.value = undefined
}

const onDeleteActionSuccess = (action: Action) => {
    actionStore.remove(action.id)
    toastUtil.success("Action deleted successfully.")
}

// --- Fetch Data
const fetchData = async () => {
    await rwnctx(fetchGH)
    await rwnctx(fetchPerms)
    await Promise.all([
        rwnctx(fetchSchedules),
        rwnctx(fetchThresholds),
        rwnctx(fetchInputs),
        rwnctx(fetchActions),
    ])
    ssred.value = ssred.value || import.meta.server
}

onBeforeMount(fetchData)
onServerPrefetch(fetchData)

//

</script>

<style lang="scss" scoped></style>
