<template>
	<VeeForm
		class="border-none pa-1"
		:initial-values="greenhouse"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<div class="d-flex align-center ga-2">
			<v-icon>mdi-account-cog</v-icon>
			<h4>Greenhouse Account</h4>
		</div>
		<span class="text-grey">You can update your account details.</span>
		<VeeField name="id" #="{ field }">
			<input type="hidden" v-model="field.value" :="field">
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
		<VeeField name="description" #="{ field, errorMessage }">
			<v-text-field
				label="Description"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-text-field>
		</VeeField>
		<v-btn
			v-show="meta.dirty"
			text="Save"
			type="submit"
			color="green"
			class="w-100 mt-3"
			elevation="0"
			:disabled="!meta.valid"
			:loading="isSubmitting"
		></v-btn>
	</VeeForm>
</template>

<script setup lang="ts">
import {
    GreenhouseUpdateSchema,
    type Greenhouse,
    type GreenhouseUpdate,
} from "~~/shared/schema/greenhouse"
import { toTypedSchema } from "@vee-validate/zod"

//

// --- Validation
const validationSchema = toTypedSchema(GreenhouseUpdateSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [greenhouse: GreenhouseUpdate]
	success: [greenhouse: Greenhouse]
}>()

const props = defineProps<{
	greenhouse: Greenhouse,
	handler?: (values: GreenhouseUpdate, event: any) => any
}>()

// --- Handling
const { update } = useGreenhouse()

const onSubmit = async (values: any, event: any) => {
	const gh = values as GreenhouseUpdate
	emit("submit", gh)
	if (props.handler) return await props.handler(gh, event)

	const udpateResult = await update(gh)
	if (!udpateResult.success) return emit("error", udpateResult.error)

	emit("success", udpateResult.data)
	event?.resetForm({ values: props.greenhouse })
}

//

</script>

<style scoped></style>
