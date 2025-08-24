<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
        :initial-values="{ ...initialValues, thresholdId }"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Create Condition</h2>
		<span class="text-grey">
			Please provide the condition details.
		</span>
        <VeeField name="thresholdId" #="{ field }">
            <input type="hidden" :value="field.value" :="field">
        </VeeField>
		<VeeField name="type" #="{ field, errorMessage }">
			<v-select
                chips
				label="Type"
				class="mt-6"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
                :items="ConditionType"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-select>
		</VeeField>
		<VeeField name="value" #="{ field, errorMessage }">
			<v-number-input
                type="number"
				label="Value"
				aria-autocomplete="both"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-number-input>
		</VeeField>
        <VeeField name="outputId" #="{ field, errorMessage }">
			<v-select
                chips
				label="Output"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
                :items="outputs"
                :item-value="o => o.id"
                :item-title="o => o.name"
				:error-messages="errorMessage ? [errorMessage] : []"
			>
                <template #item="{ props: itemProps, item }">
					<v-list-item
						:="itemProps"
						:title="item.raw.name"
						:prepend-icon="item.raw.icon"
					></v-list-item>
				</template>
            </v-select>
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
	ConditionCreateSchema,
	ConditionType,
	type Condition,
	type ConditionCreate,
} from '~~/shared/schema/condition';
import type { Output } from '~~/shared/schema/output';

//

// --- Validation
const initialValues = { type: ConditionType[0] }
const validationSchema = toTypedSchema(ConditionCreateSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [condition: ConditionCreate]
	success: [condition: Condition]
}>()

const props = defineProps<{
    outputs: Output[]
    thresholdId: number
    handler?: (values: ConditionCreate, event: any) => any
}>()

// --- CRUD
const { create } = useCondition()

const onSubmit = async (values: any, event: any) => {
    const thresh = values as ConditionCreate
    emit("submit", thresh)
    if (props.handler) return await props.handler(thresh, event)

	const createResult = await create(thresh)
	if (!createResult.success) return emit("error", createResult.error)
    emit("success", createResult.data)
    event?.resetForm({ ...initialValues, thresholdId: props.thresholdId })
}

//

</script>

<style scoped></style>
