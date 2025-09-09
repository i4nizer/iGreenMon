<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Create SMS</h2>
		<span class="text-grey"> Please provide the sms details. </span>
		<VeeField name="phone" #="{ field, errorMessage }">
			<v-text-field
				label="Phone"
				class="mt-6"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-text-field>
		</VeeField>
		<VeeField name="message" #="{ field, errorMessage }">
			<v-text-field
                multiline
				label="Message"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-text-field>
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
import { SmsSchema, type Sms } from "~~/shared/schema/sms"

//

// --- Validation
const validationSchema = toTypedSchema(SmsSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [sms: Sms]
	success: [sms: Sms]
}>()

const props = defineProps<{
	handler?: (values: Sms, event: any) => any
}>()

// --- CRUD
const onSubmit = async (values: any, event: any) => {
	const sms = values as Sms
	emit("submit", sms)
	if (props.handler) return await props.handler(sms, event)

    await $fetch(`/api/user/sms`, { method: "POST", body: sms })
        .then(() => emit("success", sms))
        .catch(console.error)
}

//
</script>

<style scoped></style>
