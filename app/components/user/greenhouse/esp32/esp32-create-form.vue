<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
		:initial-values="{ greenhouseId }"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Create Esp32</h2>
		<span class="text-grey">
			Please provide the esp32 details.
		</span>
		<VeeField name="greenhouseId" #="{ field }">
			<input type="hidden" :="field">
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
	Esp32CreateSchema,
	type Esp32,
	type Esp32Create,
} from '~~/shared/schema/esp32';

//

// --- Validation
const validationSchema = toTypedSchema(Esp32CreateSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [esp32: Esp32Create]
	success: [esp32: Esp32]
}>()

const props = defineProps<{
	handler?: (values: Esp32Create, event: any) => any
	greenhouseId: number
}>()

// --- CRUD
const { create } = useEsp32()

const onSubmit = async (values: any, event: any) => {
	const gh = values as Esp32Create
    emit("submit", gh)
    if (props.handler) return await props.handler(gh, event)

	const res = await create(gh)
	if (!res.success) return emit("error", res.error)
	emit("success", res.data)
	event?.resetForm({ greenhouseId: props.greenhouseId })
}

//

</script>

<style scoped></style>
