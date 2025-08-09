<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
		:initial-values="greenhouse"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Update Greenhouse</h2>
		<span class="text-grey">
			Please provide the greenhouse details.
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
import { GreenhouseUpdateSchema } from '~~/shared/schema/greenhouse';

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
	greenhouse: Greenhouse;
	handler?: (values: GreenhouseCreate, event: any) => any;
}>()

// --- CRUD
const { create } = useGreenhouse()

const onSubmit = async (values: any, event: any) => {
	const gh = values as GreenhouseUpdate
	emit("submit", gh)
	if (props.handler) return await props.handler(gh, event)

	const createResult = await create(gh)
	if (!createResult.success) return emit("error", createResult.error)

	emit("success", createResult.data)
	event?.resetForm()
}

//

</script>

<style scoped></style>
