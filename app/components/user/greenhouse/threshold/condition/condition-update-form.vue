<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
        :initial-values="condition"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Update Condition</h2>
		<span class="text-grey">
			Please provide the condition details.
		</span>
        <VeeField name="id" #="{ field }">
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
				v-model="field.value"
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
	ConditionUpdateSchema,
	ConditionType,
	type Condition,
	type ConditionUpdate,
} from '~~/shared/schema/condition';
import type { Output } from '~~/shared/schema/output';

//

// --- Validation
const validationSchema = toTypedSchema(ConditionUpdateSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [condition: ConditionUpdate]
	success: [condition: Condition]
}>()

const props = defineProps<{
    outputs: Output[]
    condition: Condition
    handler?: (values: ConditionUpdate, event: any) => any
}>()

// --- CRUD
const { update } = useCondition()

const onSubmit = async (values: any, event: any) => {
    const condition = values as ConditionUpdate
    emit("submit", condition)
    if (props.handler) return await props.handler(condition, event)

	const updateResult = await update(condition)
	if (!updateResult.success) return emit("error", updateResult.error)
    emit("success", updateResult.data)
    event?.resetForm(props.condition)
}

//

</script>

<style scoped></style>
