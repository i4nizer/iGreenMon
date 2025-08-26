<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
		:initial-values="{ sensorId, ...initialValues }"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Create Hook</h2>
		<span class="text-grey">
			Please provide the hook details.
		</span>
		<VeeField name="sensorId" #="{ field }">
			<input type="hidden" :="field">
		</VeeField>
		<VeeField name="type" #="{ field, errorMessage }">
			<v-select
				chips
				label="Type"
				class="mt-6"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:items="HookType"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-select>
		</VeeField>
		<VeeField name="actionId" #="{ field, errorMessage }">
			<v-select
				chips
				label="Action"
				aria-autocomplete="both"
				prepend-inner-icon="mdi-rocket"
				v-model="field.value"
				:="field"
				:items="actions"
				:item-title="(a) => a.name"
				:item-value="(a) => a.id"
				:error-messages="errorMessage ? [errorMessage] : []"
			>
				<template #item="{ props: itemProps, item }">
					<v-list-item
						:="itemProps"
						:title="item.raw.name"
					></v-list-item>
				</template>
			</v-select>
		</VeeField>
		<v-btn
			type="submit"
			text="Create"
			color="green"
			class="w-100 mt-3"
			:disabled="!meta.valid"
			:loading="isSubmitting"
		></v-btn>
	</VeeForm>
</template>

<script setup lang="ts">
import type { Action } from '~~/shared/schema/action';
import {
	HookCreateSchema,
	HookType,
	type Hook,
	type HookCreate,
} from '~~/shared/schema/hook';

//

// --- Validation
const initialValues = { type: HookType[0] }
const validationSchema = toTypedSchema(HookCreateSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [hook: HookCreate]
	success: [hook: Hook]
}>()

const props = defineProps<{
	actions: Action[]
	sensorId: number
	handler?: (values: HookCreate, event: any) => any
}>()

// --- CRUD
const { create } = useHook()

const onSubmit = async (values: any, event: any) => {
	const hook = values as HookCreate
    emit("submit", hook)
    if (props.handler) return await props.handler(hook, event)

	const res = await create(hook)
	if (!res.success) return emit("error", res.error)
	emit("success", res.data)
	event?.resetForm({ ...initialValues, sensorId: props.sensorId })
}

//

</script>

<style scoped></style>
