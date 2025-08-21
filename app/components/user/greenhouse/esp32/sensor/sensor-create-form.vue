<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
		:initial-values="{ esp32Id, ...initialValues }"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Create Sensor</h2>
		<span class="text-grey">
			Please provide the sensor details.
		</span>
		<VeeField name="esp32Id" #="{ field }">
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
		<VeeField name="description" #="{ field, errorMessage }">
			<v-text-field
				label="Description"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-text-field>
		</VeeField>
		<VeeField name="interval" #="{ field, errorMessage }">
			<v-number-input
                chips
                type="number"
				label="Interval"
				aria-autocomplete="both"
				prefix="ms"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-number-input>
		</VeeField>
		<VeeField name="disabled" #="{ field, errorMessage }">
			<v-select
                chips
				label="Disabled"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:items="[`Disabled`, `Enabled`]"
				:item-title="i => i"
				:item-value="i => i == `Disabled`"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-select>
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
import {
	SensorCreateSchema,
	type Sensor,
	type SensorCreate,
} from '~~/shared/schema/sensor';

//

// --- Validation
const initialValues = { description: "", interval: 60000, disabled: true }
const validationSchema = toTypedSchema(SensorCreateSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [sensor: SensorCreate]
	success: [sensor: Sensor]
}>()

const props = defineProps<{
	handler?: (values: SensorCreate, event: any) => any
	esp32Id: number
}>()

// --- CRUD
const { create } = useSensor()

const onSubmit = async (values: any, event: any) => {
	const sensor = values as SensorCreate
    emit("submit", sensor)
    if (props.handler) return await props.handler(sensor, event)

	const res = await create(sensor)
	if (!res.success) return emit("error", res.error)
	emit("success", res.data)
	event?.resetForm({ esp32Id: props.esp32Id, ...initialValues })
}

//

</script>

<style scoped></style>
