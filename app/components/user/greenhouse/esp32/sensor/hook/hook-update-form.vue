<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
		:initial-values="hook"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Update Hook</h2>
		<span class="text-grey">
			Please provide the hook details.
		</span>
		<VeeField name="id" #="{ field }">
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
			text="Update"
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
	HookUpdateSchema,
	HookType,
	type Hook,
	type HookUpdate,
} from '~~/shared/schema/hook';

//

// --- Validation
const validationSchema = toTypedSchema(HookUpdateSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [hook: HookUpdate]
	success: [hook: Hook]
}>()

const props = defineProps<{
	hook: Hook
	actions: Action[]
	handler?: (values: HookUpdate, event: any) => any
}>()

// --- CRUD
const { update } = useHook()

const onSubmit = async (values: any, event: any) => {
	const hook = values as HookUpdate
    emit("submit", hook)
    if (props.handler) return await props.handler(hook, event)

	const res = await update(hook)
	if (!res.success) return emit("error", res.error)
	emit("success", res.data)
	event?.resetForm(props.hook)
}

//

</script>

<style scoped></style>
