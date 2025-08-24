<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
		:initial-values="{ esp32Id, ...initialValues }"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Create Actuator</h2>
		<span class="text-grey">
			Please provide the actuator details.
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
	ActuatorCreateSchema,
	type Actuator,
	type ActuatorCreate,
} from '~~/shared/schema/actuator';

//

// --- Validation
const initialValues = { description: "", disabled: true }
const validationSchema = toTypedSchema(ActuatorCreateSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [actuator: ActuatorCreate]
	success: [actuator: Actuator]
}>()

const props = defineProps<{
	esp32Id: number
	handler?: (values: ActuatorCreate, event: any) => any
}>()

// --- CRUD
const { create } = useActuator()

const onSubmit = async (values: any, event: any) => {
	const actuator = values as ActuatorCreate
    emit("submit", actuator)
    if (props.handler) return await props.handler(actuator, event)

	const res = await create(actuator)
	if (!res.success) return emit("error", res.error)
	emit("success", res.data)
	event?.resetForm({ esp32Id: props.esp32Id, ...initialValues })
}

//

</script>

<style scoped></style>
