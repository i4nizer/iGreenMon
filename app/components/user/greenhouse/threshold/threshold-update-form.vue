<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
        :initial-values="threshold"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Update Threshold</h2>
		<span class="text-grey">
			Please provide the threshold details.
		</span>
        <VeeField name="id" #="{ field }">
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
	ThresholdUpdateSchema,
	ThresholdOperator,
	ThresholdSchema,
	type Threshold,
	type ThresholdUpdate,
} from '~~/shared/schema/threshold';

//

// --- Validation
const validationSchema = toTypedSchema(ThresholdUpdateSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [threshold: ThresholdUpdate]
	success: [threshold: Threshold]
}>()

const props = defineProps<{
	handler?: (values: ThresholdUpdate, event: any) => any
    threshold: Threshold
}>()

// --- CRUD
const { update } = useThreshold()

const onSubmit = async (values: any, event: any) => {
    const thresh = values as ThresholdUpdate
    emit("submit", thresh)
    if (props.handler) return await props.handler(thresh, event)

	const updateResult = await update(thresh)
	if (!updateResult.success) return emit("error", updateResult.error)
    emit("success", updateResult.data)
    event?.resetForm(props.threshold)
}

//

</script>

<style scoped></style>
