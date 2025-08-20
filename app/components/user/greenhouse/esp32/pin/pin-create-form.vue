<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
		:initial-values="{ esp32Id }"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Create Pin</h2>
		<span class="text-grey">
			Please provide the pin details.
		</span>
		<VeeField name="esp32Id" #="{ field }">
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
                :items="PinType"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-select>
		</VeeField>
		<VeeField name="mode" #="{ field, errorMessage }">
			<v-select
                chips
				label="Mode"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
                :items="PinMode"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-select>
		</VeeField>
		<VeeField name="number" #="{ field, errorMessage }">
			<v-number-input
                chips
                type="number"
				label="Number"
				aria-autocomplete="both"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-number-input>
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
	PinCreateSchema,
	PinMode,
	PinType,
	type Pin,
	type PinCreate,
} from '~~/shared/schema/pin';

//

// --- Validation
const validationSchema = toTypedSchema(PinCreateSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [pin: PinCreate]
	success: [pin: Pin]
}>()

const props = defineProps<{
	handler?: (values: PinCreate, event: any) => any
	esp32Id: number
}>()

// --- CRUD
const { create } = usePin()

const onSubmit = async (values: any, event: any) => {
	const pin = values as PinCreate
    emit("submit", pin)
    if (props.handler) return await props.handler(pin, event)

	const res = await create(pin)
	if (!res.success) return emit("error", res.error)
	emit("success", res.data)
	event?.resetForm({ esp32Id: props.esp32Id })
}

//

</script>

<style scoped></style>
