<template>
	<VeeForm
		class="pa-7 w-100 w-sm-75 w-md-100 w-lg-75"
        :initial-values="{ ...initialValues, scheduleId, thresholdId, greenhouseId }"
		:validation-schema="validationSchema"
		#="{ meta, isSubmitting }"
		@submit="onSubmit"
	>
		<h2 class="text-green">Create Action</h2>
		<span class="text-grey">
			Please provide the action details.
		</span>
        <VeeField name="scheduleId" #="{ field }">
            <input 
				v-if="scheduleId" 
				type="hidden" 
				:value="field.value" 
				:="field"
			>
        </VeeField>
        <VeeField name="thresholdId" #="{ field }">
            <input 
				v-if="thresholdId" 
				type="hidden" 
				:value="field.value" 
				:="field"
			>
        </VeeField>
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
		<VeeField name="delay" #="{ field, errorMessage }">
			<v-number-input
                type="number"
				label="Delay"
                prefix="ms"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-number-input>
		</VeeField>
		<VeeField name="timeout" #="{ field, errorMessage }">
			<v-number-input
                type="number"
				label="Delay"
                prefix="ms"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-number-input>
		</VeeField>
		<VeeField name="duration" #="{ field, errorMessage }">
			<v-number-input
                type="number"
				label="Duration"
                prefix="ms"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-number-input>
		</VeeField>
		<VeeField name="priority" #="{ field, errorMessage }">
			<v-number-input
                type="number"
				label="Priority"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-number-input>
		</VeeField>
		<VeeField name="inputId" #="{ field, errorMessage }">
			<v-select
                chips
				label="Input"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
                :items="inputs"
                :item-value="i => i.id"
                :item-title="i => i.name"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-select>
		</VeeField>
		<VeeField name="scheduleId" #="{ field, errorMessage }">
			<v-select
                v-if="!hideSchedule"
                chips
				label="Schedule"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
                :items="schedules ?? []"
                :item-value="s => s.id"
                :item-title="s => s.name"
				:error-messages="errorMessage ? [errorMessage] : []"
			></v-select>
		</VeeField>
		<VeeField name="thresholdId" #="{ field, errorMessage }">
			<v-select
                v-if="!hideThreshold"
                chips
				label="Threshold"
				aria-autocomplete="both"
				v-model="field.value"
				:="field"
                :items="thresholds ?? []"
                :item-value="t => t.id"
                :item-title="t => t.name"
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
import { boolean } from 'zod';
import {
	ActionCreateSchema,
	type Action,
	type ActionCreate,
} from '~~/shared/schema/action';
import type { Input } from '~~/shared/schema/input';
import type { Schedule } from '~~/shared/schema/schedule';
import type { Threshold } from '~~/shared/schema/threshold';

//

// --- Validation
const initialValues = {
    name: "",
    value: 0,
    delay: 0,
    timeout: 10000,
    duration: 5000,
    priority: 1,
}
const validationSchema = toTypedSchema(ActionCreateSchema)

// --- Data Binding
const emit = defineEmits<{
	error: [msg: string]
	submit: [action: ActionCreate]
	success: [action: Action]
}>()

const props = defineProps<{
    inputs: Input[]
    schedules?: Schedule[]
	thresholds?: Threshold[]
	scheduleId?: number
	thresholdId?: number
    greenhouseId: number
    hideSchedule?: boolean
    hideThreshold?: boolean
    handler?: (values: ActionCreate, event: any) => any
}>()

// --- CRUD
const { create } = useAction()

const onSubmit = async (values: any, event: any) => {
    const action = values as ActionCreate
    emit("submit", action)
    if (props.handler) return await props.handler(action, event)

	const createResult = await create(action)
	if (!createResult.success) return emit("error", createResult.error)
    emit("success", createResult.data)
    event?.resetForm({ ...initialValues, greenhouseId: props.greenhouseId })
}

//

</script>

<style scoped></style>
