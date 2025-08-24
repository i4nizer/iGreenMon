<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
		:initial-values="{ ...actuator }"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Update Actuator</h2>
		<span class="text-grey">
			Please provide the actuator details.
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
	ActuatorUpdateSchema,
	type Actuator,
	type ActuatorUpdate,
} from '~~/shared/schema/actuator';

//

// --- Validation
const validationSchema = toTypedSchema(ActuatorUpdateSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [actuator: ActuatorUpdate]
	success: [actuator: Actuator]
}>()

const props = defineProps<{
	actuator: Actuator
	handler?: (values: ActuatorUpdate, event: any) => any
}>()

// --- CRUD
const { update } = useActuator()

const onSubmit = async (values: any, event: any) => {
	const actuator = values as ActuatorUpdate
    emit("submit", actuator)
    if (props.handler) return await props.handler(actuator, event)

	const res = await update(actuator)
	if (!res.success) return emit("error", res.error)
	emit("success", res.data)
	event?.resetForm({ actuator: props.actuator })
}

//

</script>

<style scoped></style>
