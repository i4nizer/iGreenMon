<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
		:initial-values="{ ...sensor }"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Update Sensor</h2>
		<span class="text-grey">
			Please provide the sensor details.
		</span>
		<VeeField name="id" #="{ field }">
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
			text="Update"
			color="green"
			class="w-100 mt-3"
			:disabled="!meta.valid"
			:loading="isSubmitting"
		></v-btn>
	</VeeForm>
</template>

<script setup lang="ts">
import {
	SensorUpdateSchema,
	type Sensor,
	type SensorUpdate,
} from '~~/shared/schema/sensor';

//

// --- Validation
const validationSchema = toTypedSchema(SensorUpdateSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [sensor: SensorUpdate]
	success: [sensor: Sensor]
}>()

const props = defineProps<{
	sensor: Sensor
	handler?: (values: SensorUpdate, event: any) => any
}>()

// --- CRUD
const { update } = useSensor()

const onSubmit = async (values: any, event: any) => {
	const sensor = values as SensorUpdate
    emit("submit", sensor)
    if (props.handler) return await props.handler(sensor, event)

	const res = await update(sensor)
	if (!res.success) return emit("error", res.error)
	emit("success", res.data)
	event?.resetForm({ sensor: props.sensor })
}

//

</script>

<style scoped></style>
