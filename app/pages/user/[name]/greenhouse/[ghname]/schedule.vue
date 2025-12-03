<template>
    <v-container fluid class="bg-container pa-5 py-7">
        <v-row>
            <v-col>
                <h3>Greenhouse Schedule</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-end py-0">
                <!-- For creating schedule -->
                <v-dialog class="w-100 w-md-50">
                    <template #activator="{ props: activatorProps }">
                        <v-btn 
                            v-if="isOwnGH || canCreateSchedule" 
                            class="bg-green" 
                            :="activatorProps"
                        >
                            <v-icon class="mr-1">mdi-plus</v-icon>
                            <span v-if="$vuetify.display.smAndUp">
                                New Schedule
                            </span>
                        </v-btn>
                    </template>
                    <template #default>
                        <schedule-create-form
                            :greenhouse-id="gh?.id ?? -1"
                            class="bg-white rounded"
                            @error="e => toastUtil.error(e)"
                            @success="onCreateScheduleSuccess"
                        />
                    </template>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row>
            <!-- Schedule Update Form Dialog -->
            <v-dialog class="w-100 w-md-50" v-model="scheduleUpdateDialog">
                <template #default>
                    <schedule-update-form
                        class="bg-white rounded"
                        :schedule="(scheduleUpdateData as Schedule)"
                        @error="e => toastUtil.error(e)"
                        @success="onUpdateScheduleSuccess"
                    />
                </template>
            </v-dialog>
            <!-- Action Create Dialog -->
			<v-dialog class="w-100 w-md-50" v-model="actionCreateDialog">
				<template #default>
					<action-create-form
                        v-if="gh"
                        hide-schedule
                        hide-threshold
						class="bg-white rounded overflow-auto"
						:inputs
						:schedule-id="actionCreateScheduleId"
                        :greenhouse-id="gh.id"
						@error="(e) => toastUtil.error(e)"
						@success="onCreateActionSuccess"
					/>
				</template>
			</v-dialog>
			<!-- Action Update Dialog -->
			<v-dialog class="w-100 w-md-50" v-model="actionUpdateDialog">
				<template #default>
					<action-update-form
                        hide-schedule
                        hide-threshold
                        class="bg-white rounded overflow-auto"
						:inputs
						:action="(actionUpdateData as Action)"
						@error="(e) => toastUtil.error(e)"
						@success="onUpdateActionSuccess"
					/>
				</template>
			</v-dialog>
            <!-- Schedule Lists -->
            <v-col 
                v-if="isOwnGH || canAccessSchedule"
                v-for="schedule in schedules" 
                xs="12" 
                sm="6" 
                md="4" 
                lg="3" 
                xl="2"
                :key="schedule.id"
            >
                <schedule-card
                    :schedule
                    @edit="onEditSchedule"
                    @toggle="onToggleSchedule"
                    @delete="onDeleteSchedule"
                >
                    <template #menu="{ onEdit, onToggle, onDelete }">
                        <schedule-card-menu
                            :schedule
                            :hide-edit="!isOwnGH && !canModifySchedule"
                            :hide-toggle="!isOwnGH && !canModifySchedule"
                            :hide-delete="!isOwnGH && !canDeleteSchedule"
                            @edit="onEdit"
                            @toggle="onToggle"
                            @delete="onDelete"
                        ></schedule-card-menu>
                    </template>
                    <template #action>
                        <v-list>
                            <v-list-subheader class="d-flex justify-end">
                                <v-btn 
                                    v-if="isOwnGH || canCreateAction"
                                    text="Add Action"
                                    class="border"
                                    @click="onCreateAction(schedule)"
                                ></v-btn>
                            </v-list-subheader>
                            <v-list-item 
                                v-if="isOwnGH || canAccessAction"
                                v-for="action in actions.filter((a) => a.scheduleId == schedule.id)"
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
                            </v-list-item>
                            <v-list-item 
                                v-if="!actions.some((c) => c.scheduleId == schedule.id)" 
                                class="text-center"
                            >
                                <span class="text-grey">No Action Yet</span>
                            </v-list-item>
                        </v-list>
                    </template>
                </schedule-card>
            </v-col>
            <!-- Fallback/emptystate when no schedule -->
            <v-col v-if="schedules.length <= 0">
                <v-empty-state
                    icon="mdi-auto-fix"
                    text="You haven't created any schedule yet."
                    title="No schedule yet"
                ></v-empty-state>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import type { Schedule } from '~~/shared/schema/schedule'
import type { Greenhouse } from '~~/shared/schema/greenhouse'
import type { Condition } from '~~/shared/schema/condition'
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

const canCreateSchedule = computed(() => canCreate("Schedule", permissions))
const canAccessSchedule = computed(() => canAccess("Schedule", permissions))
const canModifySchedule = computed(() => canModify("Schedule", permissions))
const canDeleteSchedule = computed(() => canDelete("Schedule", permissions))

const fetchSchedules = async () => {
    if (!isOwnGH && !canAccessSchedule.value) return
    if (!gh.value) return;
    const res = await scheduleUtil.retrieveAll(gh.value.id)
    if (!res.success) return toastUtil.error(res.error)
    schedules.splice(0, schedules.length)
    schedules.push(...res.data)
}

// --- Schedule CRUD
const scheduleUpdateData = ref<Schedule>()
const scheduleUpdateDialog = ref(false)

const onEditSchedule = async (
    schedule: Schedule,
    opts: { loading: Ref<boolean> }
) => {
    scheduleUpdateData.value = schedule
    scheduleUpdateDialog.value = true
}

const onToggleSchedule = async (
    schedule: Schedule,
    opts: { loading: Ref<boolean> }
) => {
    opts.loading.value = true
    const res = await scheduleUtil.update(schedule)
    opts.loading.value = false

    if (!res.success) toastUtil.error(res.error)
    else onUpdateScheduleSuccess(schedule)
}

const onDeleteSchedule = async (
    schedule: Schedule,
    opts: { loading: Ref<boolean> }
) => {
    opts.loading.value = true
    const res = await scheduleUtil.destroy(schedule.id)
    opts.loading.value = false

    if (!res.success) toastUtil.error(res.error)
    else onDeleteScheduleSuccess(schedule)
}

const onCreateScheduleSuccess = (schedule: Schedule) => {
    scheduleStore.append(schedule)
    toastUtil.success("Schedule created successfully.")
}

const onUpdateScheduleSuccess = (schedule: Schedule) => {
    scheduleStore.change(schedule)
    toastUtil.success("Schedule updated successfully.")
    scheduleUpdateDialog.value = false
}

const onDeleteScheduleSuccess = (schedule: Schedule) => {
    scheduleStore.remove(schedule.id)
    toastUtil.success("Schedule deleted successfully.")
}

// --- Inputs
const inputUtil = useInput()
const inputStore = useInputStore()
const { inputs } = inputStore

const canAccessInput = computed(() => canAccess("Input", permissions))

const fetchInputs = async () => {
    if (!isOwnGH && !canAccessInput.value) return;
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
    if (!gh.value) return;
    const res = await actionUtil.retrieveAll(gh.value.id)
    if (!res.success) return toastUtil.error(res.error)
    actions.splice(0, actions.length)
    actions.push(...res.data)
}

// --- Action CRUD
const actionCreateDialog = ref(false)
const actionCreateScheduleId = ref(-1)
const actionUpdateData = ref<Action>()
const actionUpdateDialog = ref(false)

const onCreateAction = async (schedule: Schedule) => {
    actionCreateScheduleId.value = schedule.id
    actionCreateDialog.value = true
}

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
        rwnctx(fetchInputs),
        rwnctx(fetchActions),
    ])
}

onBeforeMount(fetchData)
onServerPrefetch(fetchData)

//

</script>

<style lang="scss" scoped></style>
