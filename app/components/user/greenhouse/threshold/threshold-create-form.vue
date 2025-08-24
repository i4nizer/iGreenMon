<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
        :initial-values="{ ...initialValues, greenhouseId }"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Create Threshold</h2>
		<span class="text-grey">
			Please provide the threshold details.
		</span>
        <VeeField name="greenhouseId" #="{ field }">
            <input type="hidden" :value="field.value" :="field">
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
		<VeeField name="operator" #="{ field, errorMessage }">
			<v-select
				chips
				label="Operator"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
                :items="ThresholdOperator"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-select>
		</VeeField>
		<VeeField name="disabled" #="{ field, errorMessage }">
			<v-select
				chips
				label="Disabled"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
                :items="['Disabled', 'Enabled']"
                :item-title="i => i"
                :item-value="i => i == 'Disabled'"
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
	ThresholdCreateSchema,
	ThresholdOperator,
	ThresholdSchema,
	type Threshold,
	type ThresholdCreate,
} from '~~/shared/schema/threshold';

//

// --- Validation
const initialValues = { name: "", operator: "Any", disabled: true }
const validationSchema = toTypedSchema(ThresholdCreateSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [threshold: ThresholdCreate]
	success: [threshold: Threshold]
}>()

const props = defineProps<{
    handler?: (values: ThresholdCreate, event: any) => any
    greenhouseId: number
}>()

// --- CRUD
const { create } = useThreshold()

const onSubmit = async (values: any, event: any) => {
    const thresh = values as ThresholdCreate
    emit("submit", thresh)
    if (props.handler) return await props.handler(thresh, event)

	const createResult = await create(thresh)
	if (!createResult.success) return emit("error", createResult.error)
    emit("success", createResult.data)
    event?.resetForm({ ...initialValues, greenhouseId: props.greenhouseId })
}

//

</script>

<style scoped></style>
