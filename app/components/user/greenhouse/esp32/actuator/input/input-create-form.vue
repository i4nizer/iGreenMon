<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
		:initial-values="{ actuatorId, ...initialValues }"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Create Input</h2>
		<span class="text-grey">
			Please provide the input details.
		</span>
		<VeeField name="actuatorId" #="{ field }">
			<input type="hidden" :="field">
		</VeeField>
		<VeeField name="name" #="{ field, errorMessage }">
			<v-text-field
				label="Name"
				class="mt-6"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-text-field>
		</VeeField>
		<VeeField name="icon" #="{ field, errorMessage }">
			<v-select
				label="Icon"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:items="actuatorInputIcons"
				:error-messages="errorMessage ? [errorMessage] : []"
				:prepend-inner-icon="field.value"
			>
				<template #item="{ props: itemProps, item }">
					<v-list-item
						:="itemProps"
						:title="item.raw.substring(4)"
						:prepend-icon="item.raw"
					></v-list-item>
				</template>
			</v-select>
		</VeeField>
		<VeeField name="type" #="{ field, errorMessage }">
			<v-select
				label="Type"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:items="InputType"
				:item-title="(t) => t == `Boolean` ? `Toggle` : `Numeric`"
				:item-value="(t) => t"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-select>
		</VeeField>
		<VeeField name="pinId" #="{ field, errorMessage }">
			<v-select
				label="Pin"
				aria-autocomplete="both"
				prepend-inner-icon="mdi-sine-wave"
				v-model="field.value"
				:="field"
				:items="pins"
				:item-title="(i) => `${i.type[0]}${i.number} (${i.mode})`"
				:item-value="(i) => i.id"
				:error-messages="errorMessage ? [errorMessage] : []"
			>
				<template #item="{ props: itemProps, item }">
					<v-list-item
						:="itemProps"
						:title="`${item.raw.type[0]}${item.raw.number} (${item.raw.mode})`"
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
import { actuatorInputIcons } from '~/constants/icon';
import {
	InputType,
	InputCreateSchema,
	type Input,
	type InputCreate,
} from '~~/shared/schema/input';
import type { Pin } from '~~/shared/schema/pin';

//

// --- Validation
const initialValues = { name: "", icon: "mdi-fan", type: InputType[0] }
const validationSchema = toTypedSchema(InputCreateSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [input: InputCreate]
	success: [input: Input]
}>()

const props = defineProps<{
	pins: Pin[]
	actuatorId: number
	handler?: (values: InputCreate, event: any) => any
}>()

// --- CRUD
const { create } = useInput()

const onSubmit = async (values: any, event: any) => {
	const input = values as InputCreate
    emit("submit", input)
    if (props.handler) return await props.handler(input, event)

	const res = await create(input)
	if (!res.success) return emit("error", res.error)
	emit("success", res.data)
	event?.resetForm({ actuatorId: props.actuatorId, ...initialValues })
}

//

</script>

<style scoped></style>
