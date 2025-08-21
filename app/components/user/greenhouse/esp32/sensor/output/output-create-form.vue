<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
		:initial-values="{ sensorId, ...initialValues }"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Create Output</h2>
		<span class="text-grey">
			Please provide the output details.
		</span>
		<VeeField name="sensorId" #="{ field }">
			<input type="hidden" :="field">
		</VeeField>
		<VeeField name="name" #="{ field, errorMessage }">
			<v-text-field
				label="Name"
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
				:items="sensorOutputIcons"
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
		<VeeField name="unit" #="{ field, errorMessage }">
			<v-text-field
				label="Unit"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-text-field>
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
import { sensorOutputIcons } from '~/constants/icon';
import {
	OutputCreateSchema,
	type Output,
	type OutputCreate,
} from '~~/shared/schema/output';
import type { Pin } from '~~/shared/schema/pin';

//

// --- Validation
const initialValues = { name: "", icon: "mdi-thermometer", unit: "%" }
const validationSchema = toTypedSchema(OutputCreateSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [output: OutputCreate]
	success: [output: Output]
}>()

const props = defineProps<{
	pins: Pin[]
	sensorId: number
	handler?: (values: OutputCreate, event: any) => any
}>()

// --- CRUD
const { create } = useOutput()

const onSubmit = async (values: any, event: any) => {
	const output = values as OutputCreate
    emit("submit", output)
    if (props.handler) return await props.handler(output, event)

	const res = await create(output)
	if (!res.success) return emit("error", res.error)
	emit("success", res.data)
	event?.resetForm({ sensorId: props.sensorId, ...initialValues })
}

//

</script>

<style scoped></style>
