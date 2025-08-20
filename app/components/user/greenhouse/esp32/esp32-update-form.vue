<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
		:initial-values="esp32"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Update Esp32</h2>
		<span class="text-grey">
			Please provide the esp32 details.
		</span>
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
			type="submit"
			text="Update"
			color="green"
			class="w-100 mt-3"
			:disabled="!meta.valid || !meta.dirty"
			:loading="isSubmitting"
		></v-btn>
	</VeeForm>
</template>

<script setup lang="ts">
import {
	Esp32UpdateSchema,
	type Esp32,
	type Esp32Create,
	type Esp32Update,
} from '~~/shared/schema/esp32';

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
	esp32: Esp32;
	handler?: (values: Esp32Update, event: any) => any;
}>()

// --- CRUD
const { update } = useEsp32()

const onSubmit = async (values: any, event: any) => {
	const gh = values as Esp32Update
	emit("submit", gh)
	if (props.handler) return await props.handler(gh, event)

	const res = await update(gh)
	if (!res.success) return emit("error", res.error)

	emit("success", res.data)
	event?.resetForm({ values: props.esp32 })
}

//

</script>

<style scoped></style>
