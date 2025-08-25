<template>
    <v-container fluid class="bg-container pa-5 py-7">
        <v-row>
            <v-col>
                <h3>Greenhouse Threshold</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-end py-0">
                <!-- For creating threshold -->
                <v-dialog class="w-100 w-md-50">
                    <template #activator="{ props: activatorProps }">
                        <v-btn 
                            v-if="isOwnGH || canCreateThreshold" 
                            class="bg-green" 
                            :="activatorProps"
                        >
                            <v-icon class="mr-1">mdi-plus</v-icon>
                            <span v-if="$vuetify.display.smAndUp">
                                New Threshold
                            </span>
                        </v-btn>
                    </template>
                    <template #default>
                        <threshold-create-form
                            :greenhouse-id="gh?.id ?? -1"
                            class="bg-white rounded"
                            @error="e => toastUtil.error(e)"
                            @success="onCreateThresholdSuccess"
                        />
                    </template>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row>
            <!-- Threshold Update Form Dialog -->
            <v-dialog class="w-100 w-md-50" v-model="thresholdUpdateDialog">
                <template #default>
                    <threshold-update-form
                        class="bg-white rounded"
                        :threshold="(thresholdUpdateData as Threshold)"
                        @error="e => toastUtil.error(e)"
                        @success="onUpdateThresholdSuccess"
                    />
                </template>
            </v-dialog>
            <!-- Condition Create Dialog -->
			<v-dialog class="w-100 w-md-50" v-model="conditionCreateDialog">
				<template #default>
					<condition-create-form
						class="bg-white rounded"
						:outputs
						:threshold-id="conditionCreateThresholdId"
						@error="(e) => toastUtil.error(e)"
						@success="onCreateConditionSuccess"
					/>
				</template>
			</v-dialog>
			<!-- Condition Update Dialog -->
			<v-dialog class="w-100 w-md-50" v-model="conditionUpdateDialog">
				<template #default>
					<condition-update-form
						class="bg-white rounded"
						:outputs
						:condition="(conditionUpdateData as Condition)"
						@error="(e) => toastUtil.error(e)"
						@success="onUpdateConditionSuccess"
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
						:threshold-id="actionCreateThresholdId"
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
            <!-- Threshold Lists -->
            <v-col 
                v-if="isOwnGH || canAccessThreshold"
                v-for="threshold in thresholds" 
                xs="12" 
                sm="6" 
                md="4" 
                lg="3" 
                xl="2"
                :key="threshold.id"
            >
                <threshold-card
                    :threshold
                    @edit="onEditThreshold"
                    @toggle="onToggleThreshold"
                    @delete="onDeleteThreshold"
                >
                    <template #menu="{ onEdit, onToggle, onDelete }">
                        <threshold-card-menu
                            :threshold
                            :hide-edit="!isOwnGH && !canModifyThreshold"
                            :hide-toggle="!isOwnGH && !canModifyThreshold"
                            :hide-delete="!isOwnGH && !canDeleteThreshold"
                            @edit="onEdit"
                            @toggle="onToggle"
                            @delete="onDelete"
                        ></threshold-card-menu>
                    </template>
                    <template #condition>
                        <v-list>
                            <v-list-subheader class="d-flex justify-end">
                                <v-btn 
                                    v-if="isOwnGH || canCreateCondition"
                                    text="Add Condtion"
                                    class="border"
                                    @click="onCreateCondition(threshold)"
                                ></v-btn>
                            </v-list-subheader>
                            <v-list-item 
                                v-if="isOwnGH || canAccessCondition"
                                v-for="condition in conditions.filter((c) => c.thresholdId == threshold.id)"
                                :key="condition.id"
                            >
                                <condition-card 
                                    v-if="outputs.some((o) => o.id == condition.outputId)"
                                    :output="(outputs.find((o) => o.id == condition.outputId) as Output)"
                                    :condition="condition"
                                    :hide-edit="!isOwnGH && !canModifyCondition"
                                    :hide-delete="!isOwnGH && !canDeleteCondition"
                                    @edit="onEditCondition"
                                    @delete="onDeleteCondition"
                                />
                            </v-list-item>
                            <v-list-item 
                                v-if="!conditions.some((c) => c.thresholdId == threshold.id)" 
                                class="text-center"
                            >
                                <span class="text-grey">No Condition Yet</span>
                            </v-list-item>
                        </v-list>
                    </template>
                    <template #action>
                        <v-list>
                            <v-list-subheader class="d-flex justify-end">
                                <v-btn 
                                    v-if="isOwnGH || canCreateAction"
                                    text="Add Action"
                                    class="border"
                                    @click="onCreateAction(threshold)"
                                ></v-btn>
                            </v-list-subheader>
                            <v-list-item 
                                v-if="isOwnGH || canAccessAction"
                                v-for="action in actions.filter((a) => a.thresholdId == threshold.id)"
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
                                v-if="!actions.some((c) => c.thresholdId == threshold.id)" 
                                class="text-center"
                            >
                                <span class="text-grey">No Action Yet</span>
                            </v-list-item>
                        </v-list>
                    </template>
                </threshold-card>
            </v-col>
            <!-- Fallback/emptystate when no threshold -->
            <v-col v-if="thresholds.length <= 0">
                <v-empty-state
                    icon="mdi-auto-fix"
                    text="You haven't created any threshold yet."
                    title="No threshold yet"
                ></v-empty-state>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import type { Threshold } from '~~/shared/schema/threshold'
import type { Greenhouse } from '~~/shared/schema/greenhouse'
import type { Condition } from '~~/shared/schema/condition'
import type { Output } from '~~/shared/schema/output'
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

// --- Thresholds
const thresholdUtil = useThreshold()
const thresholdStore = useThresholdStore()
const { thresholds } = thresholdStore

const canCreateThreshold = computed(() => canCreate("Threshold", permissions))
const canAccessThreshold = computed(() => canAccess("Threshold", permissions))
const canModifyThreshold = computed(() => canModify("Threshold", permissions))
const canDeleteThreshold = computed(() => canDelete("Threshold", permissions))

const fetchThresholds = async () => {
    if (!isOwnGH && !canAccessThreshold.value) return
    if (!gh.value || thresholds.length > 0) return;
    const res = await thresholdUtil.retrieveAll(gh.value.id)
    if (!res.success) return toastUtil.error(res.error)
	res.data.forEach((t) => thresholdStore.append(t))
}

// --- Threshold CRUD
const thresholdUpdateData = ref<Threshold>()
const thresholdUpdateDialog = ref(false)

const onEditThreshold = async (
    threshold: Threshold,
    opts: { loading: Ref<boolean> }
) => {
    thresholdUpdateData.value = threshold
    thresholdUpdateDialog.value = true
}

const onToggleThreshold = async (
    threshold: Threshold,
    opts: { loading: Ref<boolean> }
) => {
    opts.loading.value = true
    const res = await thresholdUtil.update(threshold)
    opts.loading.value = false

    if (!res.success) toastUtil.error(res.error)
    else onUpdateThresholdSuccess(threshold)
}

const onDeleteThreshold = async (
    threshold: Threshold,
    opts: { loading: Ref<boolean> }
) => {
    opts.loading.value = true
    const res = await thresholdUtil.destroy(threshold.id)
    opts.loading.value = false

    if (!res.success) toastUtil.error(res.error)
    else onDeleteThresholdSuccess(threshold)
}

const onCreateThresholdSuccess = (threshold: Threshold) => {
    thresholdStore.append(threshold)
    toastUtil.success("Threshold created successfully.")
}

const onUpdateThresholdSuccess = (threshold: Threshold) => {
    thresholdStore.change(threshold)
    toastUtil.success("Threshold updated successfully.")
    thresholdUpdateDialog.value = false
}

const onDeleteThresholdSuccess = (threshold: Threshold) => {
    thresholdStore.remove(threshold.id)
    toastUtil.success("Threshold deleted successfully.")
}

// --- Outputs
const outputUtil = useOutput()
const outputStore = useOutputStore()
const { outputs } = outputStore

const canAccessOutput = computed(() => canAccess("Output", permissions))

const fetchOutputs = async () => {
    if (!isOwnGH && !canAccessOutput.value) return;
    if (outputs.length > 0) return;
    const res = await outputUtil.retrieveAllByGH(ghname)
    if (!res.success) return toastUtil.error(res.error)
    res.data.forEach((o) => outputStore.append(o))
}

// --- Conditions
const conditionUtil = useCondition()
const conditionStore = useConditionStore()
const { conditions } = conditionStore

const canCreateCondition = computed(() => canCreate("Condition", permissions))
const canAccessCondition = computed(() => canAccess("Condition", permissions))
const canModifyCondition = computed(() => canModify("Condition", permissions))
const canDeleteCondition = computed(() => canDelete("Condition", permissions))

const fetchConditions = async () => { 
    if (!isOwnGH && !canAccessCondition.value) return
    if (conditions.length > 0) return;
    const res = await conditionUtil.retrieveAllByGH(ghname)
    if (!res.success) return toastUtil.error(res.error)
    res.data.forEach((c) => conditionStore.append(c))
}

// --- Condition CRUD
const conditionCreateDialog = ref(false)
const conditionCreateThresholdId = ref(-1)
const conditionUpdateData = ref<Condition>()
const conditionUpdateDialog = ref(false)

const onCreateCondition = async (threshold: Threshold) => {
    conditionCreateThresholdId.value = threshold.id
    conditionCreateDialog.value = true
}

const onEditCondition = async (
    condition: Condition,
    opts: { loading: Ref<boolean> }
) => {
    conditionUpdateData.value = condition
    conditionUpdateDialog.value = true
}

const onDeleteCondition = async (
    condition: Condition,
    opts: { loading: Ref<boolean> }
) => {
    opts.loading.value = true
    const res = await conditionUtil.destroy(condition.id)
    opts.loading.value = false

    if (!res.success) toastUtil.error(res.error)
    else onDeleteConditionSuccess(condition)
}

const onCreateConditionSuccess = (condition: Condition) => {
    conditionStore.append(condition)
    toastUtil.success("Condition created successfully.")
}

const onUpdateConditionSuccess = (condition: Condition) => {
    conditionStore.change(condition)
    toastUtil.success("Condition updated successfully.")
    conditionUpdateDialog.value = false
}

const onDeleteConditionSuccess = (condition: Condition) => {
    conditionStore.remove(condition.id)
    toastUtil.success("Condition deleted successfully.")
}

// --- Inputs
const inputUtil = useInput()
const inputStore = useInputStore()
const { inputs } = inputStore

const canAccessInput = computed(() => canAccess("Input", permissions))

const fetchInputs = async () => {
    if (!isOwnGH && !canAccessInput.value) return;
    if (inputs.length > 0) return;
    const res = await inputUtil.retrieveAllByGH(ghname)
    if (!res.success) return toastUtil.error(res.error)
    res.data.forEach((o) => inputStore.append(o))
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
    if (!gh.value || actions.length > 0) return;
    const res = await actionUtil.retrieveAll(gh.value.id)
    if (!res.success) return toastUtil.error(res.error)
    res.data.forEach((c) => actionStore.append(c))
}

// --- Action CRUD
const actionCreateDialog = ref(false)
const actionCreateThresholdId = ref(-1)
const actionUpdateData = ref<Action>()
const actionUpdateDialog = ref(false)

const onCreateAction = async (threshold: Threshold) => {
    actionCreateThresholdId.value = threshold.id
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
        rwnctx(fetchOutputs),
        rwnctx(fetchThresholds),
        rwnctx(fetchConditions),
        rwnctx(fetchInputs),
        rwnctx(fetchActions),
    ])
}

onBeforeMount(fetchData)
onServerPrefetch(fetchData)

//

</script>

<style lang="scss" scoped></style>
