<template>
	<VeeForm
		class="border-none pa-1"
		:initial-values="esp32"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<div class="d-flex align-center ga-2">
			<v-icon>mdi-account-cog</v-icon>
			<h4>Esp32 Settings</h4>
		</div>
		<span class="text-grey">You can update your esp32 details.</span>
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
    Esp32UpdateSchema,
    type Esp32,
    type Esp32Update,
} from "~~/shared/schema/esp32"

//

// --- Validation
const validationSchema = toTypedSchema(Esp32UpdateSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [esp32: Esp32Update]
	success: [esp32: Esp32]
}>()

const props = defineProps<{
	esp32: Esp32,
	handler?: (values: Esp32Update, event: any) => any
}>()

// --- Handling
const { update } = useEsp32()

const onSubmit = async (values: any, event: any) => {
	const gh = values as Esp32Update
	emit("submit", gh)
	if (props.handler) return await props.handler(gh, event)

	const udpateResult = await update(gh)
	if (!udpateResult.success) return emit("error", udpateResult.error)

	emit("success", udpateResult.data)
	event?.resetForm({ values: props.esp32 })
}

//

</script>

<style scoped></style>
